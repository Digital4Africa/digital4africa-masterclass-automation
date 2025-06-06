import express from 'express';
import { createCohort, deleteCohort, getAllCohorts, giveDiscount, updateCohort } from '../controllers/cohort.controller.js';
import { authenticateSession } from "../middlewares/authenicateSession.js";

const router = express.Router();

router.post('/create-cohort', authenticateSession, createCohort);
router.get('/all-cohorts', authenticateSession, getAllCohorts);
router.delete('/delete/:id', authenticateSession, deleteCohort);
router.put('/update/:id', authenticateSession, updateCohort);
router.post('/give-discount', authenticateSession, giveDiscount);


export default router;
