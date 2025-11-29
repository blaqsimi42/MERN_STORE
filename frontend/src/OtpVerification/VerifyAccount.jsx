import React, { useEffect, useState } from "react";
import {
  useVerifyAccountMutation,
  useResendVerificationOtpMutation,
} from "../redux/api/usersApiSlice.js";
import { Loader2, XCircle, CheckCircle, RefreshCw } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const VerifyAccount = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [status, setStatus] = useState("idle");
  const [resendSuccess, setResendSuccess] = useState("");

  const navigate = useNavigate();
  const [verifyAccount, { isLoading }] = useVerifyAccountMutation();
  const [resendVerificationOtp, { isLoading: isResending }] =
    useResendVerificationOtpMutation();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const emailParam = params.get("email");
    const otpParam = params.get("otp");
    if (emailParam && otpParam) {
      setEmail(emailParam);
      setOtp(otpParam);
      handleVerify(emailParam, otpParam);
    }
  }, []);

  const handleVerify = async (email, otp) => {
    setStatus("loading");
    try {
      const res = await verifyAccount({ email, otp }).unwrap();
      toast.success(res.message || "Account verified successfully!");
      setStatus("success");
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setStatus("failed");
      toast.error(
        err?.data?.message || "Verification failed. Please try again."
      );
    }
  };

  const handleResend = async () => {
    if (!email) return;
    try {
      const res = await resendVerificationOtp({ email }).unwrap();
      setResendSuccess(res.message);
      toast.info(res.message || "A new OTP has been sent to your email.");
    } catch (err) {
      toast.error(err?.data?.message || "Unable to resend OTP.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen  px-4">
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-md text-center w-full max-w-md transition-all duration-300">
        {status === "idle" && (
          <>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Verifying your account...
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              If nothing happens automatically, please check your email for the
              verification link.
            </p>
            <Loader2 className="mx-auto text-pink-600 animate-spin" size={36} />
          </>
        )}

        {status === "loading" && (
          <>
            <Loader2 className="mx-auto text-pink-600 animate-spin" size={40} />
            <p className="mt-3 text-gray-600 font-medium">
              Verifying your account...
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle className="mx-auto text-green-500" size={60} />
            <h2 className="text-xl font-semibold mt-4 text-gray-800">
              Account Verified!
            </h2>
            <p className="text-gray-600 mt-1">Redirecting you to login...</p>
          </>
        )}

        {status === "failed" && (
          <>
            <XCircle className="mx-auto text-red-500" size={60} />
            <h2 className="text-lg font-semibold mt-3 text-gray-800">
              Verification Failed
            </h2>
            <p className="text-gray-600 mt-1">
              Could not verify your account. You can request a new OTP below.
            </p>

            <button
              onClick={handleResend}
              disabled={isResending}
              className={`mt-5 inline-flex justify-center items-center gap-2 px-5 py-2.5 rounded-md text-white font-medium transition-all ${
                isResending
                  ? "bg-pink-400 cursor-not-allowed"
                  : "bg-pink-600 hover:bg-pink-700"
              }`}
            >
              <RefreshCw
                size={18}
                className={`${isResending ? "animate-spin" : ""}`}
              />
              {isResending ? "Resending..." : "Resend OTP"}
            </button>

            {resendSuccess && (
              <p className="mt-3 text-sm text-gray-500">{resendSuccess}</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyAccount;
