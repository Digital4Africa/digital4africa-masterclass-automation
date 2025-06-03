// models/Cohort.js

import mongoose from "mongoose";

const cohortSchema = new mongoose.Schema({
  masterclass: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Masterclass',
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

module.exports = mongoose.model('Cohort', cohortSchema);
