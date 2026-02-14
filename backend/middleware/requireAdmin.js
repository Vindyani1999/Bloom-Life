const jwt = require("jsonwebtoken");
const Admin = require("../models/admin");

exports.requireAdmin = async (req, res, next) => {
  try {
    const authHeader = String(req.headers.authorization || "");
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : authHeader;

    if (!token) {
      res.status(401).json({ message: "Unauthorized. No token provided." });
      return;
    }

    // Verify JWT token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "default-secret-change-me",
    );

    // Check if admin exists
    const admin = await Admin.findById(decoded.id);

    if (!admin) {
      res.status(401).json({ message: "Unauthorized. Invalid admin." });
      return;
    }

    // Attach admin to request
    req.admin = {
      id: admin._id,
      username: admin.username,
    };

    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      res.status(401).json({ message: "Unauthorized. Invalid token." });
    } else if (error.name === "TokenExpiredError") {
      res.status(401).json({ message: "Unauthorized. Token expired." });
    } else {
      res.status(500).json({ message: "Authorization failed." });
    }
  }
};
