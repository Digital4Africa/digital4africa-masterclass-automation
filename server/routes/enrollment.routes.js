import express from 'express';
import { validateEnrollmentBeforePayment } from '../controllers/enrollment.controller.js';

const router = express.Router();
router.post("/validate", validateEnrollmentBeforePayment);



export default router;
