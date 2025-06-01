import express from "express";
import {uploadSingleImage} from '../middlewares/uploadImageMiddleware.js'
import { createMasterclass, deleteMasterclass, updateMasterclass} from '../controllers/masterclass.controllers.js'

const router = express.Router();

router.post("/add-masterclass", uploadSingleImage, createMasterclass);
router.put("/update-masterclass/:id", uploadSingleImage, updateMasterclass);
router.delete("/remove-masterclass/:id", deleteMasterclass);
export default router