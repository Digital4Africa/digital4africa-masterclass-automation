import jwt from "jsonwebtoken";
import Admin from "../models/admin.model.js";


export const authenticateSession = async (req, res, next) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return res.status(401).json({
      success: false,
      message: "Authentication required. Please log in."
    });
  }

  try {
    const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    console.log(payload);

    if (payload.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admins only."
      });
    }

    const admin = await Admin.findById(payload.adminId);

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Admin not found"
      });
    }

    req.admin = {
      ...admin.toObject(),
      role: "admin"
    };

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        success: false,
        message: "Session expired. Please log in again."
      });
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        success: false,
        message: "Invalid token. Please log in again."
      });
    }

    return res.status(500).json({
      success: false,
      message: "Authentication error. Please try again."
    });
  }
};
