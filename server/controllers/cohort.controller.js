import Cohort from '../models/cohort.model.js';
import Masterclass from '../models/masterclass.model.js';
import Discount from '../models/discount.model.js';

export const createCohort = async (req, res) => {
  try {
    const { title, startDate, endDate } = req.body;

    if (!title || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Title, start date, and end date are required',
      });
    }

    const masterclass = await Masterclass.findOne({ title });

    if (!masterclass) {
      return res.status(404).json({
        success: false,
        message: 'Masterclass not found',
      });
    }
    console.log(masterclass);

    const newCohort = new Cohort({
      masterclassId: masterclass._id,
      masterclassTitle: masterclass.title,
      masterclassDescription: masterclass.description,
      masterclassHeroImg: masterclass.heroImage,
      masterclassPrice: masterclass.price,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      students: [],
      payments: [],
      discounts: [],
    });

    await newCohort.save();

    res.status(201).json({
      success: true,
      message: 'Cohort created successfully',

    });

  } catch (error) {
    console.error('Error creating cohort:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating cohort',
      error: error.message,
    });
  }
};



export const getAllCohorts = async (req, res) => {
  try {
    const cohorts = await Cohort.find();
    res.status(200).json({
      success: true,
      message: 'Cohorts fetched successfully',
      data: cohorts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch cohorts',
      error: error.message,
    });
  }
};

export const deleteCohort = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Cohort.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: 'Cohort not found' });
    res.status(200).json({ message: 'Cohort deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete cohort' });
  }
};
export const updateCohort = async (req, res) => {
  const { id } = req.params;
  const { title, startDate, endDate } = req.body;

  try {
    const updated = await Cohort.findByIdAndUpdate(
      id,
      { title, startDate, endDate },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Cohort not found' });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update cohort' });
  }
};

export const giveDiscount = async (req, res) => {
  try {
    const { email, masterclassTitle, cohortId, amountOff, reason } = req.body || {};

    // Collect missing fields
    const missingFields = [];
    if (!email) missingFields.push('email');
    if (!masterclassTitle) missingFields.push('masterclassTitle');
    if (!cohortId) missingFields.push('cohortId');
    if (amountOff === undefined || amountOff === null) missingFields.push('amountOff');

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required field(s): ${missingFields.join(', ')}`,
      });
    }

    // Find masterclass
    const masterclass = await Masterclass.findOne({ title: masterclassTitle });
    if (!masterclass) {
      return res.status(404).json({
        success: false,
        message: 'Masterclass not found with the provided title',
      });
    }

    // Check for existing discount for the same email and cohort
    const existingDiscount = await Discount.findOne({
      email: email.toLowerCase().trim(),
      cohortId,
    });

    if (existingDiscount) {
      return res.status(409).json({
        success: false,
        message: 'Discount already assigned to this email for the given cohort',
      });
    }

    // Create and save discount
    const discount = new Discount({
      email: email.toLowerCase().trim(),
      masterclassId: masterclass._id,
      cohortId,
      amountOff,
      reason: reason || '',
      isUsed: false,
    });

    await discount.save();

    res.status(201).json({
      success: true,
      message: 'Discount assigned successfully',
      
    });
  } catch (error) {
    console.error('Error giving discount:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while assigning discount',
      error: error.message,
    });
  }
};
