import Firebase_admin from "./firebaseAdmin.js";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    //  Check token exists
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "No token provided",
      });
    }

    const token = authHeader.split(" ")[1];

    //  Verify Firebase token
    const decoded = await Firebase_admin.auth().verifyIdToken(token);

    // attach Firebase user
    req.firebaseUser = decoded;

    //  Find user using ANY linked UID
    const user = await User.findOne({
      firebase_uid: decoded.uid,
    });
    //  IMPORTANT: user must exist for login/protected routes
    if (!user) {
      return res.status(401).json({
        message: "User not registered. Please sign up first.",
      });
    }
    //  attach DB user
    req.user = user;
    next();

  } catch (error) {
    console.error("Protect middleware error:", error);

    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};


export const verifySignup = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Check header exists
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "No token provided",
      });
    }

    const token = authHeader.split(" ")[1];

    //  Verify Firebase token
    const decoded = await Firebase_admin.auth().verifyIdToken(token);

    // Attach Firebase user to request
    req.firebaseUser = decoded;

    //  Extra safety checks
    if (!decoded.email) {
      return res.status(400).json({
        message: "Email not found in Firebase token",
      });
    }
    next();

  } catch (error) {
    console.error("Signup middleware error:", error);
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};
// Middleware to allow only admins
export const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next(); // admin allowed
  } else {
    res.status(403).json({ message: "Not authorized as an admin" });
  }
};

