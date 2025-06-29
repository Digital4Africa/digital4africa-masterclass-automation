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
    const { fullName, email, cohortId, amount, reference, phoneNumber } = req.body;

    if (!fullName || !email || !cohortId || !amount || !reference || !phoneNumber) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    let paymentRecord = await Payment.findOne({ reference });

    if (paymentRecord) {
      if (paymentRecord.status === "success") {
        return res.status(409).json({
          success: false,
          message: "Payment has already been verified and processed",
          data: paymentRecord,
        });
      } else {
        paymentRecord.customer.email = email;
        paymentRecord.cohortId = cohortId;
        paymentRecord.remarks = "Updated user info before verification";
        await paymentRecord.save();
      }
    } else {
      try {
        paymentRecord = await Payment.create({
          reference,
          amount: 0,
          currency: "KES",
          status: "pending",
          channel: "unknown",
          customer: { email, phone: phoneNumber },
          remarks: "Initiated payment verification",
          cohortId,
        });
      } catch (err) {
        if (err.code === 11000 && err.keyPattern?.reference) {
          paymentRecord = await Payment.findOne({ reference });
        } else {
          throw err;
        }
      }
    }

    const cohort = await Cohort.findById(cohortId);
    if (!cohort) {
      await Payment.findByIdAndUpdate(paymentRecord._id, {
        status: "failed",
        remarks: "Cohort not found",
      });
      return res.status(404).json({ success: false, message: "Cohort not found" });
    }

    const verifyResponse = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const paystackData = verifyResponse.data?.data;

    if (!verifyResponse.data.status || !paystackData || paystackData.status !== "success") {
      await Payment.findByIdAndUpdate(paymentRecord._id, {
        status: "failed",
        remarks: "Paystack verification failed or payment was not successful",
      });
      return res.status(400).json({
        success: false,
        message: "Payment verification failed or was not successful",
      });
    }

    const payAmount = paystackData.amount / 100;

    const discountDoc = await Discount.findOne({ email, cohortId, isUsed: false });
    const discountAmount = discountDoc?.amountOff || 0;

    let existingPayRecord = cohort.payments.find(p => p.email === email);

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

    const alreadyStudent = cohort.students.some(s => s.email === email);
    if (!alreadyStudent) {
      cohort.students.push({ fullName, email, phone: phoneNumber });
    }

    await cohort.save();

    await Payment.findOneAndUpdate(
      { reference },
      {
        amount: payAmount,
        currency: paystackData.currency,
        status: paystackData.status,
        channel: paystackData.channel,
        // customer: {
        //   email: paystackData.customer.email,
        //   phone: paystackData.customer.phone || "",
        // },
        remarks: "Payment successful and student enrolled",
      },
      { new: true }
    );

    const updatedPayRecord = cohort.payments.find(p => p.email === email);
    const totalFinalPay = updatedPayRecord.amount + (updatedPayRecord.discount || 0);
    const balance = cohort.masterclassPrice - totalFinalPay;

    // Fire-and-forget emails (run in background)
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
          });
        }
      })
      .catch((err) => {
        console.error("⚠️ Background email error:", err.message);
      });

    // Keep WebSocket notification in main flow (it's fast)
    const wss = getWSS();
    if (wss) {
      wss.clients.forEach((client) => {
        if (client.readyState === 1) {
          client.send(JSON.stringify({ type: 'ENROLLMENT_CONFIRMATION' }));
        }
      });
    }

    // Immediate response
    return res.status(200).json({
      success: true,
      message: "Payment verified and student enrolled",
      data: {
        cohortPrice: cohort.masterclassPrice,
        discount: updatedPayRecord.discount,
        amountPaid: updatedPayRecord.amount,
        balanceRemaining: balance > 0 ? balance : 0,
      }
    });

  } catch (error) {
    console.log("error while enrolling student: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getPayments = async (req, res) => {
  try {
    // Parse query parameters
    const page = parseInt(req.query.page) || 1;
    const limitParam = req.query.limit;
    const { fromDate, toDate, status } = req.query;

    // Handle 'all' records case
    const isAll = limitParam === 'all';
    const limit = isAll ? null : parseInt(limitParam) || 10;
    const skip = isAll ? null : (page - 1) * limit;

    // Build filter object
    const filter = {};

    // Date range filter
    if (fromDate && toDate) {
      filter.createdAt = {
        $gte: new Date(fromDate),
        $lte: new Date(toDate)
      };
    }

    // Status filter (if provided and not 'all')
    if (status && status !== 'all') {
      filter.status = status;
    }

    // Get total count of documents (for pagination meta)
    const totalItems = await Payment.countDocuments(filter);

    // Build query
    let query = Payment.find(filter)
      .sort({ createdAt: -1 }); // Newest first

    // Apply pagination if not fetching all records
    if (!isAll) {
      query = query.skip(skip).limit(limit);
    }

    // Execute query
    const payments = await query.exec();

    // Prepare response
    const response = {
      success: true,
      message: 'Payments fetched successfully',
      data: payments,
      meta: {
        totalItems,
        currentPage: page,
        totalPages: isAll ? 1 : Math.ceil(totalItems / limit)
      }
    };

    return res.status(200).json(response);

  } catch (error) {
    console.error('Error fetching payments:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching payment records'
    });
  }
};