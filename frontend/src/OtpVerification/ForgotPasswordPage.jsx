import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Mail, Loader2 } from "lucide-react";
import { useRequestPasswordResetMutation } from "../redux/api/usersApiSlice";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const [requestPasswordReset, { isLoading }] =
    useRequestPasswordResetMutation();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await requestPasswordReset({ email }).unwrap();
      toast.success("OTP sent to your email!");
      navigate(`/reset-password?email=${encodeURIComponent(email)}`);
    } catch (error) {
      toast.error(error?.data?.message || error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center mt-40">
      <h1 className="text-2xl font-semibold mb-4">Forgot Password</h1>

      <form onSubmit={submitHandler} className="space-y-4 w-[20rem]">
        {/* Email Input */}
        <div className="relative flex items-center bg-gray-100 rounded-md p-2">
          <Mail className="text-gray-500 mr-2" size={20} />
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-gray-100 w-full text-black focus:outline-none border-none"
          />
        </div>

        {/* Button with Loader */}
        <button
          type="submit"
          disabled={isLoading}
          className="flex justify-center items-center gap-2 bg-pink-500 hover:bg-pink-600 disabled:bg-pink-300 text-white font-medium px-4 py-2 rounded-md w-full transition"
        >
          {isLoading ? "Sending OTP..." : "Send OTP"}
          {isLoading && <Loader2 size={18} className="animate-spin" />}
        </button>
      </form>
    </div>
  );
};

export default ForgotPasswordPage;
