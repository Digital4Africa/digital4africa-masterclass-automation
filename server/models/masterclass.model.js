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
		
		price: {
			type: Number,
			required: true,
		},


		heroImage: {
			type: String,
			required: false,
		},



	},
	{
		timestamps: true,
	}
);

const Masterclass = mongoose.model("Masterclass", masterclassSchema);

export default Masterclass;
