const Admin = require("../models/admin");
const jwt = require("jsonwebtoken");

exports.loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body || {};

    if (!username || !password) {
      res.status(400).json({ message: "Username and password are required." });
      return;
    }

    // Find admin by username
    const admin = await Admin.findOne({
      username: username.toLowerCase().trim(),
    });

    if (!admin) {
      res.status(401).json({ message: "Invalid credentials." });
      return;
    }

    // Compare password
    const isMatch = await admin.comparePassword(password);

    if (!isMatch) {
      res.status(401).json({ message: "Invalid credentials." });
      return;
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: admin._id, username: admin.username },
      process.env.JWT_SECRET || "default-secret-change-me",
      { expiresIn: "7d" },
    );

    res.status(200).json({
      token,
      admin: {
        id: admin._id,
        username: admin.username,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};

// Create admin (for seeding or initial setup)
exports.createAdmin = async (req, res) => {
  try {
    const { username, password } = req.body || {};

    if (!username || !password) {
      res.status(400).json({ message: "Username and password are required." });
      return;
    }

    const existingAdmin = await Admin.findOne({
      username: username.toLowerCase().trim(),
    });

    if (existingAdmin) {
      res.status(400).json({ message: "Admin already exists." });
      return;
    }

    const admin = new Admin({
      username: username.toLowerCase().trim(),
      password,
    });

    await admin.save();

    res.status(201).json({
      message: "Admin created successfully",
      admin: {
        id: admin._id,
        username: admin.username,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create admin", error: error.message });
  }
};
