import Cohort from '../models/cohort.model.js';
import Masterclass from '../models/masterclass.model.js';

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

    const newCohort = new Cohort({
      masterclassId: masterclass._id,
	  masterclassTitle: masterclass.title,
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
    res.status(200).json(cohorts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cohorts' });
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

