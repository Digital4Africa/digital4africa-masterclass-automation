import express from "express";
import {
  registerAdmin,
  loginAdmin,
  refreshToken,
  logoutAdmin,
  deleteAdmin,
  updateAdminDetails,
  resetAdminPassword,
} from "../controllers/auth.controllers.js";
import { authenticateSession } from "../middlewares/authenicateSession.js";

const router = express.Router();

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.get("/refresh-token", refreshToken);
router.post("/logout", logoutAdmin);

router.delete("/delete", authenticateSession, deleteAdmin);
router.put("/update", authenticateSession, updateAdminDetails);
router.put("/reset-password", authenticateSession, resetAdminPassword);

export default router;
