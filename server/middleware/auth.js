const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware to verify if user is logged in
const protect = async (req, res, next) => {
  let token = req.headers.authorization;

  // Check if Authorization header contains Bearer token
  if (token && token.startsWith("Bearer")) {
    try {
      // Extract token from "Bearer TOKEN"
      token = token.split(" ")[1];

      // Verify JWT token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Fetch user from database and attach to request
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res
          .status(401)
          .json({ message: "Not authorized, user not found" });
      }

      next(); // allow request to continue
    } catch (error) {
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

// Middleware to allow only admins
const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next(); // admin allowed
  } else {
    res.status(403).json({ message: "Not authorized as an admin" });
  }
};

module.exports = { protect, admin };
