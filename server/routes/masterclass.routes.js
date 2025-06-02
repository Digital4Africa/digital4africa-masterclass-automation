import express from "express";
import {uploadSingleImage} from '../middlewares/uploadImageMiddleware.js'
import { createMasterclass, deleteMasterclass, getAllMasterclasses, updateMasterclass} from '../controllers/masterclass.controllers.js'
import { authenticateSession } from "../middlewares/authenicateSession.js";

const router = express.Router();

router.post("/add-masterclass", uploadSingleImage, authenticateSession, createMasterclass);
router.put("/update-masterclass/:id", uploadSingleImage, authenticateSession, updateMasterclass);
router.delete("/remove-masterclass/:id", authenticateSession, deleteMasterclass);
router.get("/all-masterclasses", authenticateSession, getAllMasterclasses)
export default router