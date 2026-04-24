const User = require("../models/User");
const OTP = require("../models/OTP");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendOTPEmail } = require("../utils/email");

// Generate 6 digit OTP
const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// Create JWT token containing user id and role
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// ================= REGISTER USER =================

exports.register = async (req, res) => {
  try {
    const firebaseUser = req.firebaseUser;
    const { name, role } = req.body;
    const email = firebaseUser.email.toLowerCase(); // 
    const uid = firebaseUser.uid;
    const finalName =
    name || firebaseUser.name || firebaseUser.displayName || "User";

    // 🔍 find existing user
    let user = await User.findOne({ email });

    // ================= EXISTING USER =================
    if (user) {
      return res.status(400).json({
        message: "Account already exists using . Please login."
      });
    }

    // ================= NEW USER =================
    user = await User.create({
      name: finalName,
      email,
      role: role || "user",
      firebase_uid: uid, //  single UID (simpler than array)
      isVerified: firebaseUser.email_verified || false,
    });

    res.status(201).json({
      message: "User created successfully",
      user,
    });

  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

// ================= LOGIN USER =================

exports.login = async (req, res) => {
  try {
    const firebaseUser = req.firebaseUser;
    console.log(firebaseUser);

    const user = await User.findOne({
      firebase_uid: firebaseUser.uid,
    });
    console.log(user);

    //  user not found
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    //  email not verified
    if (!firebaseUser.email_verified) {
      return res.status(403).json({
        message: "Please verify your email first",
        needsVerification: true,
      });
    }

    if (!user.isVerified) {
      user.isVerified = true;
      await user.save();
    }
    console.log(user);

    //  success
    return res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
    });

  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

// ================= VERIFY OTP =================

exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const validOTP = await OTP.findOne({
      email,
      otp,
      action: "account_verification",
    });

    if (!validOTP) {
      return res.status(400).json({
        message: "Invalid or expired OTP",
      });
    }

    // Mark user as verified
    const user = await User.findOneAndUpdate(
      { email },
      { isVerified: true },
      { new: true },
    );

    // Delete OTP after successful verification
    await OTP.deleteOne({ _id: validOTP._id });

    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user.id, user.role),
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
    });
  }
};

// ================= FORGOT PASSWORD =================
exports.forgotPassword = async (req, res) => {
  try {

    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate OTP
    const otp = generateOTP();

    // Delete old OTP
    await OTP.deleteMany({ email, action: "password_reset" });

    // Save OTP for password reset
    await OTP.create({
      email,
      otp,
      action: "password_reset"
    });

    // Send OTP email
    await sendOTPEmail(email, otp, "password_reset");

    res.json({ message: "OTP sent to email" });

  } catch (error) {

    console.error(error);

    res.status(500).json({ message: "Server error" });

  }
};



// ================= RESET PASSWORD =================
exports.resetPassword = async (req, res) => {

  try {

    // Get email, OTP and new password from request body
    const { email, otp, newPassword } = req.body;


    // Check if OTP exists for this email and action = password_reset
    const validOTP = await OTP.findOne({
      email,
      otp,
      action: "password_reset"
    });


    // If OTP is invalid or expired
    if (!validOTP) {
      return res.status(400).json({ message: "Invalid OTP" });
    }


    // Hash the new password before saving to database
    const hashedPassword = await bcrypt.hash(newPassword, 10);


    // Update user's password
    await User.findOneAndUpdate(
      { email },
      { password: hashedPassword }
    );


    // Delete OTP after successful password reset (security)
    await OTP.deleteOne({ _id: validOTP._id });


    // Send success response
    res.json({ message: "Password reset successful" });


  } catch (error) {

    // Catch unexpected server errors
    res.status(500).json({ message: "Server error" });

  }

};


