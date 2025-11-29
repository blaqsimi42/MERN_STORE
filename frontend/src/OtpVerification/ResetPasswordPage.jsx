import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { Mail, Lock, Eye, EyeOff, CheckCircle, Loader2 } from "lucide-react";
import { useResetPasswordMutation } from "../redux/api/usersApiSlice";

const ResetPasswordPage = () => {
  const search = useLocation().search;
  const emailParam = new URLSearchParams(search).get("email") || "";

  const [email, setEmail] = useState(emailParam);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const passwordRules = {
    length: newPassword.length >= 8,
    uppercase: /[A-Z]/.test(newPassword),
    lowercase: /[a-z]/.test(newPassword),
    number: /[0-9]/.test(newPassword),
    symbol: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword),
  };

  const isPasswordValid = Object.values(passwordRules).every(Boolean);
  const doPasswordsMatch = newPassword === confirmPassword;

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!isPasswordValid) {
      toast.error(
        "Password must be at least 8 characters, include uppercase, lowercase, number, and symbol!"
      );
      return;
    }

    if (!doPasswordsMatch) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      await resetPassword({ email, otp, newPassword }).unwrap();
      toast.success("Password reset successful!");
      navigate("/login");
    } catch (error) {
      toast.error(error?.data?.message || error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center mt-[10rem]">
      <h1 className="text-2xl font-semibold mb-4">Reset Password</h1>

      <form onSubmit={submitHandler} className="space-y-4 w-[20rem]">
        {/* Email */}
        <div className="relative flex items-center bg-gray-100 rounded-md p-2">
          <Mail className="text-gray-500 mr-2" size={20} />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-gray-100 w-full text-black focus:outline-none border-none"
          />
        </div>

        {/* OTP */}
        <div className="relative flex items-center bg-gray-100 rounded-md p-2">
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="bg-gray-100 w-full text-black focus:outline-none border-none"
          />
        </div>

        {/* New Password */}
        <div className="relative flex items-center bg-gray-100 rounded-md p-2">
          <Lock className="text-gray-500 mr-2" size={20} />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="bg-gray-100 w-full text-black focus:outline-none border-none"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="ml-2 text-gray-500"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* Confirm Password */}
        <div className="relative flex items-center bg-gray-100 rounded-md p-2">
          <Lock className="text-gray-500 mr-2" size={20} />
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="bg-gray-100 w-full text-black focus:outline-none border-none"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="ml-2 text-gray-500"
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* Password Hints */}
        {newPassword.length > 0 && (
          <div className="text-sm mb-2 space-y-1">
            {Object.entries(passwordRules).map(([key, valid]) => {
              let hintText = "";
              switch (key) {
                case "length":
                  hintText = "Minimum 8 characters";
                  break;
                case "uppercase":
                  hintText = "At least 1 uppercase letter";
                  break;
                case "lowercase":
                  hintText = "At least 1 lowercase letter";
                  break;
                case "number":
                  hintText = "At least 1 number";
                  break;
                case "symbol":
                  hintText = "At least 1 symbol";
                  break;
                default:
                  break;
              }
              return (
                <div
                  key={key}
                  className="flex items-center gap-1 transition-colors duration-300 transform motion-safe:animate-fade-in"
                >
                  <CheckCircle
                    size={16}
                    className={`transition-transform duration-300 ${
                      valid
                        ? "text-green-400 scale-110"
                        : "text-red-400 scale-100"
                    }`}
                  />
                  <span className={valid ? "text-green-400" : "text-red-400"}>
                    {hintText}
                  </span>
                </div>
              );
            })}

            {!doPasswordsMatch && confirmPassword.length > 0 && (
              <div className="flex items-center gap-1 text-red-400">
                <CheckCircle size={16} className="scale-100" />
                <span>Passwords do not match</span>
              </div>
            )}
          </div>
        )}

        {/* Submit Button with Loader */}
        <button
          disabled={isLoading}
          type="submit"
          className="flex justify-center items-center gap-2 bg-pink-500 hover:bg-pink-600 disabled:bg-pink-300 text-white font-medium px-4 py-2 rounded-md w-full transition"
        >
          {isLoading ? "Resetting..." : "Reset Password"}
          {isLoading && <Loader2 size={18} className="animate-spin" />}
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordPage;
