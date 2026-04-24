const mongoose = require("mongoose");

// User schema defines how user data will be stored in MongoDB
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true, // prevents duplicate accounts
      lowercase: true,
      trim: true,
    },
    
    firebase_uid: {
      type: String,
      required: true,
    },
    // Role helps differentiate between normal user and admin
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    // Used for email verification after signup
    isVerified: {
      type: Boolean,
      default: false,
    },
  },

  // Automatically adds createdAt and updatedAt
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
