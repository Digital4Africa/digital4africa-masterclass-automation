import express from 'express';
import { enrollStudentAfterPayment, validateEnrollmentBeforePayment } from '../controllers/enrollment.controller.js';

const router = express.Router();
router.post("/validate", validateEnrollmentBeforePayment);
router.post("/complete", enrollStudentAfterPayment);



export default router;
