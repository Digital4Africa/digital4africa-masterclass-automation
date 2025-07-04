
import mongoose from "mongoose";

const paymentSubSchema = new mongoose.Schema({
  email: { type: String, required: true },
  amount: { type: Number, required: true, default: 0 },
  discount: { type: Number, default: 0 },
}, { _id: false });

const studentSubSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
}, { _id: false });

const additionalEmailContentSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['welcome', '7day', '2day', 'dayOf', 'lastDay']
  },
  subject: { type: String, required: true },
  content: { type: String, required: true },
  links: [{ type: String }],
}, { _id: true });

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
  startDate: {
    type: Date,
    required: true,
    set: function(date) {
      return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    }
  },
  endDate: {
    type: Date,
    required: true,
    set: function(date) {
      return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    }
  },
  startTime: {
    type: String,
    default: "08:30"
  },
  endTime: {
    type: String,
    default: "17:00"
  },
  additionalEmailContent: [additionalEmailContentSchema],
  emailNotifications: [{
    email: String,
    oneWeekReminderSent: Boolean,
    twoDayReminderSent: Boolean,
    dayOfReminderSent: Boolean,
    lastDayReminderSent: Boolean
  }],
  students: [studentSubSchema],
  payments: [paymentSubSchema]
}, {
  timestamps: true
});

const Cohort = mongoose.model('Cohort', cohortSchema);
export default Cohort;