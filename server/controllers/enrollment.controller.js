import Cohort from "../models/cohort.model.js";
import Discount from "../models/discount.model.js";
import Payment from "../models/payment.model.js";
import axios from "axios";
import { sendReceiptEmail } from "../utils/sendReciept.js";
import { sendEnrollmentConfirmationEmail } from "../utils/sendWelcomeEmail.js";
import { getWSS } from "../config/websockets.js";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

export const validateEnrollmentBeforePayment = async (req, res) => {
  try {
    const { fullName, email, cohortId, amount, phoneNumber } = req.body;

    if (!fullName) {
      return res.status(400).json({
        success: false,
        message: "Full name is required.",
      });
    }

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
      });
    }

    if (!cohortId) {
      return res.status(400).json({
        success: false,
        message: "Cohort ID is required.",
      });
    }

    if (amount === undefined) {
      return res.status(400).json({
        success: false,
        message: "Amount is required.",
      });
    }

    if (!phoneNumber) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required.",
      });
    }

    const cohort = await Cohort.findById(cohortId);
    if (!cohort) {
      return res.status(404).json({
        success: false,
        message: "Cohort not found.",
      });
    }

    const cohortPrice = cohort.masterclassPrice;

    const existingPayment = cohort.payments.find((p) => p.email === email);
    console.log("existingPayment: ", existingPayment);
    const allocatedDiscount = existingPayment?.discount || 0;
    const alreadyPaid = existingPayment ? existingPayment.amount + allocatedDiscount : 0;
    console.log("alreadyPaid: ", alreadyPaid);

    if (alreadyPaid >= cohortPrice) {
      return res.status(400).json({
        success: false,
        message: "You have already fully paid for this masterclass. No further payment is required.",
      });
    }

    const discount = await Discount.findOne({ email, cohortId, isUsed: false });
    const discountAmount = discount ? discount.amountOff : 0;

    const totalAfterThisPayment = parseFloat(alreadyPaid) + parseFloat(amount) + parseFloat(discountAmount);
    console.log("incoming amount: ", parseFloat(amount));

    console.log("totalAfterThisPayment: ", totalAfterThisPayment);
    console.log("cohortPrice: ", cohortPrice);

    if (totalAfterThisPayment > cohortPrice) {
      const overpay = totalAfterThisPayment - cohortPrice;
      let message = `You're overpaying by ${overpay}.`;
      if (discountAmount > 0) {
        message += ` You have a discount of ${discountAmount}.`;
      }
      message += ` Please pay exactly ${cohortPrice - alreadyPaid - discountAmount}.`;

      return res.status(400).json({
        success: false,
        message,
      });
    }



    return res.status(200).json({
      success: true,
      message: "Proceed with payment",
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

export const enrollStudentAfterPayment = async (req, res) => {
  try {
    const { fullName, email, cohortId, amount, reference, phoneNumber, isDirect } = req.body;

    if (!fullName || !email || !cohortId || !reference || !phoneNumber) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    let paymentRecord = await Payment.findOne({ reference });

    if (paymentRecord && paymentRecord.status === "success") {
      return res.status(409).json({
        success: false,
        message: "Payment has already been processed",
        data: paymentRecord,
      });
    }

    if (!paymentRecord) {
      paymentRecord = await Payment.create({
        reference,
        amount: isDirect ? amount : 0,
        currency: "KES",
        status: isDirect ? "success" : "pending",
        channel: isDirect ? "direct" : "unknown",
        customer: { email, phone: phoneNumber },
        remarks: isDirect ? "Direct enrollment" : "Initiated payment verification",
        cohortId,
      });
    }

    const cohort = await Cohort.findById(cohortId);
    if (!cohort) {
      await Payment.findByIdAndUpdate(paymentRecord._id, {
        status: "failed",
        remarks: "Cohort not found",
      });
      return res.status(404).json({ success: false, message: "Cohort not found" });
    }

    if (!isDirect) {
      const verifyResponse = await axios.get(
        `https://api.paystack.co/transaction/verify/${reference}`,
        { headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` } }
      );

      if (!verifyResponse.data.status || verifyResponse.data.data.status !== "success") {
        await Payment.findByIdAndUpdate(paymentRecord._id, {
          status: "failed",
          remarks: "Paystack verification failed",
        });
        return res.status(400).json({
          success: false,
          message: "Payment verification failed",
        });
      }
      paymentRecord.amount = verifyResponse.data.data.amount / 100;
      paymentRecord.status = verifyResponse.data.data.status;
      paymentRecord.channel = verifyResponse.data.data.channel;
      await paymentRecord.save();
    }

    const discountDoc = await Discount.findOne({ email, cohortId, isUsed: false });
    const discountAmount = discountDoc?.amountOff || 0;

    let existingPayRecord = cohort.payments.find(p => p.email === email);
    const payAmount = isDirect ? amount : paymentRecord.amount;

    if (existingPayRecord) {
      existingPayRecord.amount += payAmount;
      if (!existingPayRecord.discount && discountAmount) {
        existingPayRecord.discount = discountAmount;
      }
    } else {
      cohort.payments.push({
        email,
        amount: payAmount,
        discount: discountAmount || 0,
      });
    }

    if (discountDoc) {
      discountDoc.isUsed = true;
      await discountDoc.save();
    }

    if (!cohort.students.some(s => s.email === email)) {
      cohort.students.push({ fullName, email, phone: phoneNumber });
    }

    await cohort.save();

    const updatedPayRecord = cohort.payments.find(p => p.email === email);
    const totalFinalPay = updatedPayRecord.amount + (updatedPayRecord.discount || 0);
    const balance = cohort.masterclassPrice - totalFinalPay;

    Promise.resolve()
      .then(async () => {
        await sendReceiptEmail({
          fullName,
          startDate: cohort.startDate,
          email,
          reference,
          amountPaid: updatedPayRecord.amount,
          totalPrice: cohort.masterclassPrice,
          cohortName: cohort.masterclassTitle,
          balanceRemaining: balance,
          discount: updatedPayRecord.discount,
        });

        if (balance <= 0) {
          await sendEnrollmentConfirmationEmail({
            fullName,
            email,
            cohortName: cohort.masterclassTitle,
            startDate: cohort.startDate,
            startTime: cohort.startTime,
            endTime: cohort.endTime,
            additionalEmailContent: cohort.additionalEmailContent
          });
        }
      })
      .catch((err) => {
        console.log("error while enrolling student", err);
      });

    const wss = getWSS();
    if (wss) {
      wss.clients.forEach((client) => {
        if (client.readyState === 1) {
          client.send(JSON.stringify({ type: 'ENROLLMENT_CONFIRMATION', isDirect: isDirect  }));
        }
      });
    }

    return res.status(200).json({
      success: true,
      message: "Student enrolled successfully",
      data: {
        cohortPrice: cohort.masterclassPrice,
        discount: updatedPayRecord.discount,
        amountPaid: updatedPayRecord.amount,
        balanceRemaining: balance > 0 ? balance : 0,
      }
    });

  } catch (error) {
    console.log("error while enrolling student", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getPayments = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limitParam = req.query.limitParam || req.query.limit;
    const { fromDate, toDate, status } = req.query;

    const isAll = limitParam === 'all';
    const limit = isAll ? null : parseInt(limitParam) || 10;
    const skip = isAll ? null : (page - 1) * limit;

    const filter = {};

    if (fromDate && toDate) {
      const start = new Date(fromDate);
      const end = new Date(toDate);
      end.setUTCHours(23, 59, 59, 999);          // include entire "toDate"
      filter.createdAt = { $gte: start, $lte: end };
    }

    if (status && status !== 'all') {
      filter.status = status;
    }

    const totalItems = await Payment.countDocuments(filter);

    let query = Payment.find(filter).sort({ createdAt: -1 });

    if (!isAll) {
      query = query.skip(skip).limit(limit);
    }

    const payments = await query.exec();

    return res.status(200).json({
      success: true,
      message: 'Payments fetched successfully',
      data: payments,
      meta: {
        totalItems,
        currentPage: page,
        totalPages: isAll ? 1 : Math.ceil(totalItems / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching payments:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching payment records'
    });
  }
};



export const getFinancialMetricsMTD = async (req, res) => {
  try {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const monthStart = new Date(currentYear, currentMonth, 1);

    // 1. Fetch successful payments within current month
    const payments = await Payment.find({
      status: 'success',
      createdAt: { $gte: monthStart, $lte: currentDate }
    }).lean();

    // 2. Fetch used discounts within current month
    const discounts = await Discount.find({
      isUsed: true,
      updatedAt: { $gte: monthStart, $lte: currentDate }
    }).lean();

    // 3. Calculate metrics
    const totalRevenueMTD = payments.reduce((sum, payment) => sum + payment.amount, 0);
    const totalDiscountsMTD = discounts.reduce((sum, discount) => sum + discount.amountOff, 0);
    const netRevenueMTD = totalRevenueMTD - totalDiscountsMTD;

    return res.status(200).json({
      success: true,
      data: {
        totalRevenueMTD,
        totalDiscountsMTD,
        netRevenueMTD,
        paymentCount: payments.length,
        discountCount: discounts.length,
        startDate: monthStart,
        endDate: currentDate
      }
    });

  } catch (error) {
    console.error('Error calculating MTD metrics:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to calculate financial metrics'
    });
  }
};