import Admin from "../models/admin.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";



// Token generator
const generateTokens = (admin) => {
	const payload = { adminId: admin._id, role: "admin" };

	const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
		expiresIn: "40m",
	});

	const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
		expiresIn: "1h",
	});

	return { accessToken, refreshToken };
};

const verifyPassword = async (inputPassword, hashedPassword) => {
	return await bcrypt.compare(inputPassword, hashedPassword);
};


// Register admin
export const registerAdmin = async (req, res) => {
	try {
		const { firstName, lastName, email, password } = req.body;

		const existingAdmin = await Admin.findOne({ email });
		if (existingAdmin) {
			return res.status(409).json({ success: false, message: "Email already in use" });
		}

		const hashedPassword = await bcrypt.hash(password, 10);
		const newAdmin = new Admin({ firstName, lastName, email, password: hashedPassword });
		await newAdmin.save();

		res.status(201).json({ success: true, message: "Admin registered successfully" });
	} catch (error) {
		console.error("Registration Error:", error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};

// Login admin
export const loginAdmin = async (req, res) => {
	const { email, password } = req.body;

	try {
		const admin = await Admin.findOne({ email });
		if (!admin) return res.status(400).json({ success: false, message: "Access Denied" });

		const isMatch = await verifyPassword(password, admin.password);
		if (!isMatch) return res.status(400).json({ success: false, message: "Access Denied" });

		const { accessToken, refreshToken } = generateTokens(admin);

		res.cookie("refreshToken", refreshToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			maxAge: 12 * 60 * 60 * 1000,
		});

		res.status(200).json({
			success: true,
			message: "Login successful",
			admin: {
				firstName: admin.firstName,
				lastName: admin.lastName,
				email: admin.email,
			},
			accessToken,
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({ success: false, message: "Server error" });
	}
};

// Refresh token
export const refreshToken = async (req, res) => {
	try {

		const admin = req.admin

		if (!admin) {
			return res.status(401).json({ success: false, message: "Admin not found" });
		}

		// Only generate new access token
		const accessToken = jwt.sign(
			{ adminId: admin._id },
			process.env.JWT_SECRET,
			{ expiresIn: "40m" } // Adjust expiry as needed
		);

		res.status(200).json({
			success: true,
			message: "Access token refreshed",
			admin: {
				firstName: admin.firstName,
				lastName: admin.lastName,
				email: admin.email,
			},
			accessToken,
		});
	} catch (error) {
		console.error(error);
		res.status(401).json({ success: false, message: "Invalid or expired refresh token" });
	}
};

// Logout admin
export const logoutAdmin = (req, res) => {
	res.clearCookie("refreshToken", {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		path: "/",
	});
	return res.status(200).json({ success: true, message: "Logout successful" });
};

// Delete admin
export const deleteAdmin = async (req, res) => {
	try {
		const adminId = req.admin._id;

		const admin = await Admin.findByIdAndDelete(adminId);
		if (!admin) return res.status(404).json({ success: false, message: "Admin not found" });

		res.status(200).json({ success: true, message: "Admin deleted successfully" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};

// Update admin details
export const updateAdminDetails = async (req, res) => {
	try {
		const { firstName, lastName, email } = req.body;
		const admin = req.admin; // from auth middleware

		const existingEmail = await Admin.findOne({ email });
		if (existingEmail && existingEmail._id.toString() !== admin._id.toString()) {
			return res.status(409).json({ success: false, message: "Email already in use" });
		}

		admin.firstName = firstName || admin.firstName;
		admin.lastName = lastName || admin.lastName;
		admin.email = email || admin.email;

		await admin.save();

		res.status(200).json({ success: true, message: "Admin updated successfully" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};

// Reset password
export const resetAdminPassword = async (req, res) => {
	const { currentPassword, newPassword } = req.body;
	const admin = req.admin;

	if (!currentPassword || !newPassword) {
		return res.status(400).json({ success: false, message: "All fields are required" });
	}

	if (newPassword.length < 8) {
		return res.status(400).json({ success: false, message: "New password must be at least 8 characters" });
	}

	try {
		const isMatch = await verifyPassword(currentPassword, admin.password);
		if (!isMatch) {
			return res.status(400).json({ success: false, message: "Current password is incorrect" });
		}

		admin.password = await bcrypt.hash(newPassword, 10);
		await admin.save();

		res.status(200).json({ success: true, message: "Password updated successfully" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};
