// controllers/enrollmentController.js

import Cohort from "../models/Cohort.js";
import Discount from "../models/Discount.js";

export const validateEnrollmentBeforePayment = async (req, res) => {
	try {
		const { fullName, email, cohortId, amount } = req.body;

		if (!fullName || !email || !cohortId || amount === undefined) {
			return res.status(400).json({ error: "Full name, email, amount, and cohortId are required." });
		}

		const cohort = await Cohort.findById(cohortId);
		if (!cohort) {
			return res.status(404).json({ error: "Cohort not found." });
		}

		const cohortPrice = cohort.masterclassPrice;


		const existingPayment = cohort.payments.find(p => p.email === email);
		const allocatedDiscount = existingPayment && existingPayment.discount ? existingPayment.discount : 0;
		const alreadyPaid = existingPayment ? (existingPayment.amount + allocatedDiscount) : 0;

		if (alreadyPaid >= cohort.masterclassPrice) {
			return res.status(400).json({
				error: "You have already fully paid for this masterclass. No further payment is required."
			});
		}


		const discount = await Discount.findOne({ email, cohortId, isUsed: false });
		const discountAmount = discount ? discount.amountOff : 0;


		const totalAfterThisPayment = alreadyPaid + amount;
		const allowedTotal = cohortPrice - discountAmount;

		if (totalAfterThisPayment > allowedTotal) {
			const overpay = totalAfterThisPayment - allowedTotal;
			return res.status(400).json({
				error: `You're overpaying by ${overpay}. You have a discount of ${discountAmount}. Please pay exactly ${allowedTotal - alreadyPaid}.`,
			});
		}

		if (totalAfterThisPayment === allowedTotal) {
			return res.status(200).json({
				success: true,
				message: "This payment completes your enrollment. Proceed to Paystack.",
				isFinalPayment: true,
				remainingBalance: 0,
				discountUsed: !!discount,
			});
		}

		const remainingBalance = allowedTotal - totalAfterThisPayment;

		return res.status(200).json({
			success: true,
			message: "Partial payment is accepted. Proceed to Paystack.",
			isFinalPayment: false,
			remainingBalance,
			discountUsed: !!discount,
		});

	} catch (error) {
		console.error("Enrollment validation failed:", error);
		res.status(500).json({ error: "Internal server error." });
	}
};
