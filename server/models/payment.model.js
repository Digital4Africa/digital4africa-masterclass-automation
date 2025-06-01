import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
	{
		learner: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Learner",
			required: true,
		},
		masterclass: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Masterclass",
			required: true,
		},
		reference: {
			type: String,
			required: true,
			unique: true,
		},
		amount: {
			type: Number, // Store in base unit (e.g. KES cents if Paystack returns it that way)
			required: true,
		},
		currency: {
			type: String,
			default: "KES",
		},
		status: {
			type: String,
			enum: ["pending", "success", "failed"],
			default: "pending",
		},
		channel: {
			type: String,
			enum: [
				"card",
				"bank",
				"ussd",
				"qr",
				"mobile_money",
				"bank_transfer",
				"eft",
				"unknown",
				"simulated"
			],
			default: "unknown",
		},
		customer: {
			email: { type: String },
			phone: { type: String },
		},
		remarks: {
			type: String,
			default: "",
		},
	},
	{
		timestamps: true,
	}
);

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
