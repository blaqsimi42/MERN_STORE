import React, { useState, useEffect } from "react";
import {
  useVerifyAccountMutation,
  useResendVerificationOtpMutation,
} from "../redux/api/usersApiSlice";
import { useSelector, useDispatch } from "react-redux";
import { updateVerificationStatus } from "../redux/features/auth/authSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Loader2, RefreshCcw, CheckCircle2 } from "lucide-react";
import confetti from "canvas-confetti";

const VerifyOtp = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [success, setSuccess] = useState(false);

  const [verifyAccount, { isLoading }] = useVerifyAccountMutation();
  const [resendVerificationOtp, { isLoading: isResending }] =
    useResendVerificationOtpMutation();

  // Countdown for resend button
  useEffect(() => {
    if (timer > 0) {
      const countdown = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(countdown);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  // 🎉 Trigger confetti on success
  const triggerConfetti = () => {
    const duration = 1000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#ec4899", "#f472b6", "#fb7185"],
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#ec4899", "#f472b6", "#fb7185"],
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otp) {
      toast.error("Please enter your OTP");
      return;
    }

    try {
      const res = await verifyAccount({ email: userInfo.email, otp }).unwrap();
      toast.success(res.message || "Account verified successfully!");
      dispatch(updateVerificationStatus(true));

      setSuccess(true);
      triggerConfetti();
      setTimeout(() => navigate("/"), 2500);
    } catch (err) {
      toast.error(err?.data?.message || "Invalid or expired OTP");
    }
  };

  const handleResend = async () => {
    if (!userInfo?.email) return;
    try {
      const res = await resendVerificationOtp({
        email: userInfo.email,
      }).unwrap();
      toast.success(res.message || "OTP resent successfully!");
      setTimer(30);
      setCanResend(false);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to resend OTP");
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <CheckCircle2
          size={80}
          className="text-green-500 animate-bounce mb-4"
        />
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Account Verified!
        </h2>
        <p className="text-gray-600">Redirecting you to the homepage...</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen  px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg text-center w-full max-w-md transition-all duration-300">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">
          Verify Your Account
        </h1>
        <p className="text-gray-500 mb-6 leading-relaxed">
          Enter the 6-digit OTP sent to your email:
          <br />
          <span className="font-semibold text-pink-600 break-all">
            {userInfo.email}
          </span>
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full text-center text-2xl tracking-widest border border-gray-300 rounded-md py-3 mb-5 focus:outline-none focus:ring-2 focus:ring-pink-500 text-black"
            placeholder="------"
          />

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-md text-white font-semibold transition-all ${
              isLoading
                ? "bg-pink-400 cursor-not-allowed"
                : "bg-pink-600 hover:bg-pink-700"
            }`}
          >
            {isLoading && <Loader2 className="animate-spin" size={18} />}
            {isLoading ? "Verifying..." : "Verify Now"}
          </button>
        </form>

        {/* Resend OTP section */}
        <div className="mt-6 text-gray-600 text-sm">
          {canResend ? (
            <button
              onClick={handleResend}
              disabled={isResending}
              className="text-pink-600 font-semibold hover:underline flex items-center justify-center gap-1 mx-auto"
            >
              {isResending ? (
                <>
                  <Loader2 size={14} className="animate-spin" /> Sending...
                </>
              ) : (
                <>
                  <RefreshCcw size={14} /> Resend OTP
                </>
              )}
            </button>
          ) : (
            <p>
              Didn’t get your code?{" "}
              <span className="font-semibold text-gray-400">
                Resend in {timer}s
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;
