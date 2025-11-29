import User from "../models/userModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import bcrypt from "bcryptjs";
import createToken from "../utils/createToken.js";
import { generateOTP } from "../utils/generateOTP.js";
import sendEmail from "../utils/sendEmail.js";

// Template Imports
import accountVerificationTemplate from "../utils/emailTemplates/accountVerificationTemplate.js";
import passwordResetTemplate from "../utils/emailTemplates/passwordResetTemplate.js";
import resetOtpTemplate from "../utils/emailTemplates/resetOTPTemplate.js";
import verifyOtpTemplate from "../utils/emailTemplates/verifyOTPTemplate.js";
import welcomeTemplate from "../utils/emailTemplates/welcomeTemplate.js";

// ========================== REGISTER USER ==========================
const createUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    res.status(400);
    throw new Error("Please fill all inputs");
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const otp = generateOTP();
  const otpExpire = Date.now() + 10 * 60 * 1000;

  const newUser = new User({
    username,
    email,
    password: hashedPassword,
    verificationOTP: otp,
    verificationOTPExpire: otpExpire,
    profileImage: "/uploads/default.png",
  });

  await newUser.save();

  // Send verification email (non-blocking)
  try {
    const { subject, message } = accountVerificationTemplate(
      username,
      email,
      otp
    );
    await sendEmail({ to: email, subject, message });
  } catch (error) {
    console.error("Verification email failed to send:", error.message);
  }

  createToken(res, newUser._id);

  res.status(201).json({
    message:
      "Account created successfully. Please check your email for OTP to verify your account.",
    _id: newUser._id,
    username: newUser.username,
    email: newUser.email,
    isAdmin: newUser.isAdmin,
    isVerified: newUser.isVerified,
    profileImage: newUser.profileImage,
  });
});

// ========================== VERIFY ACCOUNT ==========================
const verifyUserAccount = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (user.isVerified) {
    res.status(400);
    throw new Error("Account already verified");
  }

  if (user.verificationOTP !== otp || user.verificationOTPExpire < Date.now()) {
    res.status(400);
    throw new Error("Invalid or expired OTP");
  }

  user.isVerified = true;
  user.verificationOTP = undefined;
  user.verificationOTPExpire = undefined;
  await user.save();

  try {
    const { subject, message } = welcomeTemplate(user.username);
    await sendEmail({ to: user.email, subject, message });
  } catch (error) {
    console.error("Welcome email failed:", error.message);
  }

  res.json({ message: "Account verified successfully" });
});

// ========================== LOGIN USER ==========================
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password are required");
  }

  const existingUser = await User.findOne({ email });
  if (!existingUser) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(password, existingUser.password);
  if (!isPasswordValid) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  createToken(res, existingUser._id);

  res.status(200).json({
    _id: existingUser._id,
    username: existingUser.username,
    email: existingUser.email,
    isAdmin: existingUser.isAdmin,
    isVerified: existingUser.isVerified,
    profileImage: existingUser.profileImage || "/uploads/default.png",
  });
});

// ========================== OTP & PASSWORD ROUTES ==========================
const resendVerificationOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (user.isVerified) {
    res.status(400);
    throw new Error("Account already verified");
  }

  const otp = generateOTP();
  user.verificationOTP = otp;
  user.verificationOTPExpire = Date.now() + 10 * 60 * 1000;
  await user.save();

  try {
    const { subject, message } = resetOtpTemplate(user.username, otp);
    await sendEmail({ to: user.email, subject, message });
    res.json({ message: "A new OTP has been sent to your email" });
  } catch (error) {
    console.error("Failed to resend OTP:", error.message);
    res.json({
      message:
        "Account updated but email could not be sent. Please try resending again later.",
    });
  }
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const otp = generateOTP();
  user.resetPasswordOTP = otp;
  user.resetPasswordOTPExpire = Date.now() + 10 * 60 * 1000;
  await user.save();

  try {
    const { subject, message } = passwordResetTemplate(user.username, otp);
    await sendEmail({ to: user.email, subject, message });
    res.json({ message: "Password reset OTP sent to your email" });
  } catch (error) {
    console.error("Password reset email failed:", error.message);
    res.json({
      message:
        "We couldn't send the password reset email. Please try again later.",
    });
  }
});

const resetPassword = asyncHandler(async (req, res) => {
  const { email, otp, newPassword } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (
    user.resetPasswordOTP !== otp ||
    user.resetPasswordOTPExpire < Date.now()
  ) {
    res.status(400);
    throw new Error("Invalid or expired OTP");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  user.password = hashedPassword;
  user.resetPasswordOTP = undefined;
  user.resetPasswordOTPExpire = undefined;
  await user.save();

  try {
    const { subject, message } = verifyOtpTemplate(user.username);
    await sendEmail({ to: user.email, subject, message });
  } catch (error) {
    console.error("Password reset confirmation email failed:", error.message);
  }

  res.json({ message: "Password reset successful" });
});

// ========================== LOGOUT ==========================
const logoutCurrentUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logged out successfully" });
});

// ========================== ADMIN / PROFILE ==========================
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  if (!users) {
    res.status(404);
    throw new Error("No users found");
  }
  res.json(users);
});

const getCurrentUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error("User not found.");
  }
  res.json({
    _id: user._id,
    username: user.username,
    email: user.email,
    isVerified: user.isVerified,
    profileImage: user.profileImage || "/uploads/default.png",
  });
});

const updateCurrentUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.username = req.body.username || user.username;
  user.email = req.body.email || user.email;

  if (req.body.password) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    user.password = hashedPassword;
  }

  if (req.body.profileImage) {
    user.profileImage = req.body.profileImage;
  }

  const updatedUser = await user.save();

  res.json({
    _id: updatedUser._id,
    username: updatedUser.username,
    email: updatedUser.email,
    isAdmin: updatedUser.isAdmin,
    isVerified: updatedUser.isVerified,
    profileImage: updatedUser.profileImage || "/uploads/default.png",
  });
});

// ========================== CRUD BY ID ==========================
const deleteUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found.");
  }

  if (user.isAdmin) {
    res.status(400);
    throw new Error("Cannot delete Admin User");
  }

  await User.deleteOne({ _id: user._id });
  res.json({ message: "User successfully removed" });
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  res.json(user);
});

const updateUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.username = req.body.username || user.username;
  user.email = req.body.email || user.email;
  user.isAdmin = Boolean(req.body.isAdmin);

  if (req.body.profileImage) {
    user.profileImage = req.body.profileImage;
  }

  const updatedUser = await user.save();

  res.json({
    _id: updatedUser._id,
    username: updatedUser.username,
    email: updatedUser.email,
    isAdmin: updatedUser.isAdmin,
    isVerified: updatedUser.isVerified,
    profileImage: updatedUser.profileImage || "/uploads/default.png",
  });
});

// ========================== UPLOAD USER IMAGE ==========================
const uploadUserImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No image file provided" });
  }

  res.status(200).json({
    message: "Image uploaded successfully",
    image: `/${req.file.path}`,
  });
});

const updateUserProfileImage = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (!req.body.image) {
    return res.status(400).json({ message: "No image provided" });
  }

  user.profileImage = req.body.image;
  await user.save();

  res.status(200).json({
    message: "Profile image updated successfully",
    profileImage: user.profileImage,
  });
});

export {
  createUser,
  verifyUserAccount,
  resendVerificationOtp,
  forgotPassword,
  resetPassword,
  loginUser,
  logoutCurrentUser,
  getAllUsers,
  getCurrentUserProfile,
  updateCurrentUserProfile,
  deleteUserById,
  getUserById,
  updateUserById,
  uploadUserImage,
  updateUserProfileImage,
};
