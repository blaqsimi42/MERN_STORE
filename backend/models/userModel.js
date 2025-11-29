import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },

    // For account verification
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
    },

    // OTP verification & reset password
    verificationOTP: { type: String },
    verificationOTPExpire: { type: Date },
    resetPasswordOTP: { type: String },
    resetPasswordOTPExpire: { type: Date },

    //Profile Picture
    profileImage: {
      type: String,
      default: "/uploads/default.png",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
