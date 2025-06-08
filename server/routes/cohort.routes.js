import express from 'express';
import { createCohort, deleteCohort, getAllCohorts, getStudentsCohortDetails, giveDiscount,  updateCohortDetails } from '../controllers/cohort.controller.js';
import { authenticateSession } from "../middlewares/authenicateSession.js";

const router = express.Router();

router.post('/create-cohort', authenticateSession, createCohort);
router.put('/update', authenticateSession, updateCohortDetails);
router.get('/all-cohorts', authenticateSession, getAllCohorts);
router.get('/students-cohorts',  getStudentsCohortDetails);
router.delete('/delete/:id', authenticateSession, deleteCohort);
router.post('/give-discount', authenticateSession, giveDiscount);


export default router;
