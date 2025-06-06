import mongoose from "mongoose";

const discountSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    cohortId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cohort",
      required: true,
    },

    masterclassId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Masterclass",
      required: true,
    },
    amountOff: {
      type: Number,
      required: true,
    },
    reason: {
      type: String,
      default: "",
    },
    isUsed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Discount = mongoose.model("Discount", discountSchema);

export default Discount;
