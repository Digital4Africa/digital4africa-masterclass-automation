// controllers/enrollmentController.js

import Cohort from "../models/cohort.model.js";
import Discount from "../models/discount.model.js";

export const validateEnrollmentBeforePayment = async (req, res) => {
	try {
		const { fullName, email, cohortId, amount } = req.body;

		if (!fullName || !email || !cohortId || amount === undefined) {
			return res.status(400).json({
				success: false,
				message: "Full name, email, amount, and cohortId are required.",
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

		const existingPayment = cohort.payments.find(p => p.email === email);
		const allocatedDiscount = existingPayment && existingPayment.discount ? existingPayment.discount : 0;
		const alreadyPaid = existingPayment ? (existingPayment.amount + allocatedDiscount) : 0;

		if (alreadyPaid >= cohortPrice) {
			return res.status(400).json({
				success: false,
				message: "You have already fully paid for this masterclass. No further payment is required.",
			});
		}

		const discount = await Discount.findOne({ email, cohortId, isUsed: false });
		const discountAmount = discount ? discount.amountOff : 0;

		const totalAfterThisPayment = alreadyPaid + amount + discountAmount;
		const allowedTotal = cohortPrice - alreadyPaid;

		if (totalAfterThisPayment > allowedTotal) {
			const overpay = totalAfterThisPayment - allowedTotal;

			let message = `You're overpaying by ${overpay}.`;
			if (discountAmount > 0) {
				message += ` You have a discount of ${discountAmount}.`;
			}
			message += ` Please pay exactly ${allowedTotal - alreadyPaid - discountAmount}.`;

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
		console.error("Enrollment validation failed:", error);
		res.status(500).json({
			success: false,
			message: "Internal server error.",
		});
	}
};

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

export const enrollStudentAfterPayment = async (req, res) => {
  try {
    const { fullName, email, cohortId, amount, reference } = req.body;

    if (!reference || !email || !cohortId || !amount || !fullName) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const existingPayment = await Payment.findOne({ reference });
    if (existingPayment) {
      return res.status(409).json({
        success: false,
        message: "Payment with this reference already exists",
        data: existingPayment,
      });
    }

    const cohort = await Cohort.findById(cohortId);
    if (!cohort) {
      return res.status(404).json({
        success: false,
        message: "Cohort not found",
      });
    }

    // ✅ Verify with Paystack
    const verifyResponse = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const paystackData = verifyResponse.data?.data;

    if (
      !verifyResponse.data.status ||
      !paystackData ||
      paystackData.status !== "success"
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed or was not successful",
      });
    }

    const payAmount = paystackData.amount / 100; // Convert to KES if needed

    // ✅ Check for discount
    const discountDoc = await Discount.findOne({
      email,
      cohortId,
      isUsed: false,
    });

    const discountAmount = discountDoc?.amountOff || 0;

    // ✅ Save payment transaction
    const newPayment = await Payment.create({
      cohortId,
      reference,
      amount: payAmount,
      currency: paystackData.currency || "KES",
      status: "success",
      channel: paystackData.channel || "unknown",
      customer: {
        email: paystackData.customer.email || email,
        phone: paystackData.customer.phone || "",
      },
      discount: discountAmount || 0,
      remarks: "Paystack payment verified",
    });

    // ✅ Update cohort payments array
    const existingPayRecord = cohort.payments.find(p => p.email === email);
    if (existingPayRecord) {
      existingPayRecord.amount += payAmount;
      if (discountAmount && !existingPayRecord.discount) {
        existingPayRecord.discount = discountAmount;
      }
    } else {
      cohort.payments.push({
        email,
        amount: payAmount,
        discount: discountAmount || 0,
      });
    }

    // ✅ Mark discount as used
    if (discountDoc) {
      discountDoc.isUsed = true;
      await discountDoc.save();
    }

    // ✅ Add student if not already added
    const alreadyStudent = cohort.students.some(s => s.email === email);
    if (!alreadyStudent) {
      cohort.students.push({
        fullName,
        email,
      });
    }

    await cohort.save();

    return res.status(200).json({
      success: true,
      message: "Payment verified and student enrolled",
      data: {
        student: { fullName, email },
        cohortId,
        payment: newPayment,
      },
    });
  } catch (error) {
    console.error("enrollStudentAfterPayment error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
