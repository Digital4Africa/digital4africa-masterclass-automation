import express from 'express';
import { enrollStudentAfterPayment, validateEnrollmentBeforePayment, getPayments, getFinancialMetricsMTD } from '../controllers/enrollment.controller.js';

const router = express.Router();
router.post("/validate", validateEnrollmentBeforePayment);
router.post("/complete", enrollStudentAfterPayment);
router.get("/payments", getPayments);
router.get("/payment-metrics", getFinancialMetricsMTD);




export default router;
