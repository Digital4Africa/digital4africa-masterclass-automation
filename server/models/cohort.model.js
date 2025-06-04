// models/Cohort.js

import mongoose from "mongoose";

const cohortSchema = new mongoose.Schema({
  masterclassId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Masterclass',
    required: true
  },

  masterclassTitle: {
    type: String,
    required: true
  },

  startDate: {
    type: Date,
    required: true
  },

  endDate: {
    type: Date,
    required: true
  },

  students: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Learner'
    }
  ],

  payments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment'
    }
  ],

  discounts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Discount'
    }
  ]
}, {
  timestamps: true
});
const Cohort = mongoose.model('Cohort', cohortSchema)
export default Cohort
