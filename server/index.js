import express from 'express';
import dotenv from 'dotenv';

import corsMiddleware from './config/cors.js';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import masterclassRoutes from './routes/masterclass.routes.js'
import cohortRoutes from './routes/cohort.routes.js'
import enrollmentsRoutes from './routes/enrollment.routes.js'
import cookieParser from 'cookie-parser';
import { startEmailScheduler } from './utils/emailScheduler.js';




dotenv.config();

connectDB();
startEmailScheduler();


const app = express();
const PORT = process.env.PORT || 3000;

app.use(corsMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/masterclass', masterclassRoutes)
app.use('/api/v1/cohort', cohortRoutes)
app.use('/api/v1/enrollment', enrollmentsRoutes)

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the API' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
