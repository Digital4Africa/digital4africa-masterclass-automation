import mongoose from "mongoose";

const paymentSubSchema = new mongoose.Schema({
  email: { type: String, required: true },
  amount: { type: Number, required: true, default: 0 },
  discount: { type: Number, default: 0 },
}, { _id: false });

const studentSubSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
}, { _id: false });

const cohortSchema = new mongoose.Schema({
  masterclassId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Masterclass',
    required: true
  },
  masterclassTitle: { type: String, required: true },
  masterclassDescription: { type: String, required: true },
  masterclassHeroImg: { type: String, required: true },
  masterclassPrice: { type: Number, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  emailNotifications: [{
    email: String,
    oneWeekReminderSent: Boolean,
    twoDayReminderSent: Boolean,
    dayOfReminderSent: Boolean
  }],
  students: [studentSubSchema],
  payments: [paymentSubSchema]
}, {
  timestamps: true
});

const Cohort = mongoose.model('Cohort', cohortSchema);
export default Cohort;
