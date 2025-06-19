import express from 'express';
import { enrollStudentAfterPayment, validateEnrollmentBeforePayment, getPayments } from '../controllers/enrollment.controller.js';

const router = express.Router();
router.post("/validate", validateEnrollmentBeforePayment);
router.post("/complete", enrollStudentAfterPayment);
router.get("/payments", getPayments);




export default router;
