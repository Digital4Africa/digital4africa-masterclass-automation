import Cohort from '../models/cohort.model.js';
import Masterclass from '../models/masterclass.model.js';
import Discount from '../models/discount.model.js';
import { getWSS } from "../config/websockets.js";
export const createCohort = async (req, res) => {
  try {
    const { title, startDate, endDate, startTime, endTime, additionalEmailContent } = req.body;

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
      masterclassDescription: masterclass.description,
      masterclassHeroImg: masterclass.heroImage,
      masterclassPrice: masterclass.price,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      startTime: startTime || "08:30",
      endTime: endTime || "17:00",
      additionalEmailContent: additionalEmailContent || [],
      students: [],
      payments: [],
      discounts: [],
    });

    await newCohort.save();

    const wss = getWSS();
    if (wss) {
      wss.clients.forEach((client) => {
        if (client.readyState === 1) {
          client.send(JSON.stringify({ type: 'NEW_COHORT_CREATED' }));
        }
      });
    }
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

export const updateCohortDetails = async (req, res) => {
  try {
    const {
      cohortId,
      masterclassId,
      masterclassPrice,
      startDate,
      endDate,
      startTime,
      endTime,
      additionalEmailContent
    } = req.body;

    if (!cohortId || !masterclassId || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'cohortId, masterclassId, startDate, and endDate are required',
      });
    }

    const masterclass = await Masterclass.findById(masterclassId);

    if (!masterclass) {
      return res.status(404).json({
        success: false,
        message: 'Masterclass not found',
      });
    }

    const updateData = {
      masterclassId: masterclass._id,
      masterclassTitle: masterclass.title,
      masterclassDescription: masterclass.description,
      masterclassHeroImg: masterclass.heroImage,
      masterclassPrice: masterclassPrice || masterclass.price,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    };

    // Add optional fields if they exist in the request
    if (startTime) updateData.startTime = startTime;
    if (endTime) updateData.endTime = endTime;
    if (additionalEmailContent) updateData.additionalEmailContent = additionalEmailContent;

    const updatedCohort = await Cohort.findByIdAndUpdate(
      cohortId,
      updateData,
      { new: true }
    );

    if (!updatedCohort) {
      return res.status(404).json({
        success: false,
        message: 'Cohort not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Cohort updated successfully',
      data: updatedCohort,
    });
  } catch (error) {
    console.error('Error updating cohort:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating cohort',
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

export const getStudentsCohortDetails = async (req, res) => {
  try {
    const today = new Date();

    const cohorts = await Cohort.find({
      endDate: { $gte: today }, // Not ended yet
    }).select(
      '_id masterclassId masterclassHeroImg masterclassTitle masterclassDescription masterclassPrice startDate endDate startTime endTime'
    );

    const filteredCohorts = cohorts
      .filter(cohort => {
        const start = new Date(cohort.startDate);
        return start > today || (start <= today && new Date(cohort.endDate) >= today);
      })
      .map(cohort => ({
        cohortId: cohort._id,
        masterclassId: cohort.masterclassId,
        masterclassHeroImg: cohort.masterclassHeroImg,
        masterclassTitle: cohort.masterclassTitle,
        masterclassDescription: cohort.masterclassDescription,
        masterclassPrice: cohort.masterclassPrice,
        startDate: cohort.startDate,
        endDate: cohort.endDate,
        startTime: cohort.startTime,
        endTime: cohort.endTime
      }));

    res.status(200).json({
      success: true,
      message: 'Filtered student cohort details',
      data: filteredCohorts,
    });
  } catch (error) {
    console.error('Error fetching student cohort details:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching student cohort details',
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
