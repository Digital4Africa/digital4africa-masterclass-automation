import express from 'express';
import { enrollStudentAfterPayment, validateEnrollmentBeforePayment, getPayments, getFinancialMetricsMTD } from '../controllers/enrollment.controller.js';
import { authenticateSession } from "../middlewares/authenicateSession.js";

const router = express.Router();
router.post("/validate", validateEnrollmentBeforePayment);
router.post("/complete", enrollStudentAfterPayment);
router.get("/payments", authenticateSession, getPayments);
router.get("/payment-metrics", authenticateSession, getFinancialMetricsMTD);




export default router;
