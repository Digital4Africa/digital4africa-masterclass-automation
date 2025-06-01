import mongoose from "mongoose";

const learnerSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    enrolledMasterclasses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Masterclass",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Learner = mongoose.model("Learner", learnerSchema);

export default Learner;
