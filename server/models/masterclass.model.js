import mongoose from "mongoose";

const masterclassSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
			trim: true,
		},
		description: {
			type: String,
			required: true,
		},
		startDate: {
			type: Date,
			required: true,
		},
		endDate: {
			type: Date,
			required: true,
		},
		price: {
			type: Number,
			required: true,
		},

		isActive: {
			type: Boolean,
			default: true,
		},
		heroImage: {
			type: String,
			required: false,
		},
		startDate: {
			type: Date,
			required: true,
		},

		endDate: {
			type: Date,
			required: true,
		},


	},
	{
		timestamps: true,
	}
);

const Masterclass = mongoose.model("Masterclass", masterclassSchema);

export default Masterclass;
