import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setCredientials } from "../../redux/features/auth/authSlice";
import { toast } from "react-toastify";
import { useRegisterMutation } from "../../redux/api/usersApiSlice";
import signupBanner from "../../assets/signupBanner.jpg";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  Loader2,
} from "lucide-react";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const passwordRules = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    symbol: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const isPasswordValid = Object.values(passwordRules).every(Boolean);

  // ✅ Password Strength Logic
  const getPasswordStrength = () => {
    const passed = Object.values(passwordRules).filter(Boolean).length;
    if (passed <= 2)
      return { label: "Weak", color: "bg-red-500", width: "w-1/3" };
    if (passed === 3 || passed === 4)
      return { label: "Medium", color: "bg-yellow-400", width: "w-2/3" };
    if (passed === 5)
      return { label: "Strong", color: "bg-green-500", width: "w-full" };
    return { label: "", color: "", width: "w-0" };
  };
  const strength = getPasswordStrength();

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    if (!isPasswordValid) {
      toast.error(
        "Password must be at least 8 characters, include uppercase, lowercase, number, and symbol!"
      );
      return;
    }

    try {
      const res = await register({ username, email, password }).unwrap();
      dispatch(setCredientials({ ...res }));
      navigate(redirect);
      toast.success("User Successfully registered");
    } catch (error) {
      console.log(error);
      toast.error(error?.data?.message || error.message);
    }
  };

  return (
    <section className="ml-16 md:justify-center lg:ml-24 flex flex-wrap">
      {/* Left Form */}
      <div className="mr-16 mt-12 md:mt-20">
        <h1 className="text-2xl font-semibold mb-4">Register</h1>

        <form
          onSubmit={submitHandler}
          className="container w-100 space-y-6"
        >
          {/* Username */}
          <div className="relative flex items-center bg-gray-100 rounded-md p-2">
            <User className="text-gray-500 mr-2" size={20} />
            <input
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-gray-100 w-full text-black focus:outline-none border-none"
            />
          </div>

          {/* Email */}
          <div className="relative flex items-center bg-gray-100 rounded-md p-2">
            <Mail className="text-gray-500 mr-2" size={20} />
            <input
              type="email"
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-gray-100 w-full text-black focus:outline-none border-none"
            />
          </div>

          {/* Password */}
          <div className="relative flex flex-col bg-gray-100 rounded-md p-2">
            <div className="flex items-center">
              <Lock className="text-gray-500 mr-2" size={20} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

            {/* ✅ Password Strength Bar (Fade in/out) */}
            <div
              className={`transition-all duration-500 ${
                password.length > 0 ? "opacity-100 mt-2" : "opacity-0 h-0"
              }`}
            >
              <div className="w-full h-2 bg-gray-300 rounded-full overflow-hidden">
                <div
                  className={`h-2 rounded-full ${strength.color} ${strength.width} transition-all duration-500`}
                ></div>
              </div>
              {password.length > 0 && (
                <p
                  className={`text-xs mt-1 transition-colors ${
                    strength.label === "Weak"
                      ? "text-red-500"
                      : strength.label === "Medium"
                      ? "text-yellow-500"
                      : "text-green-500"
                  }`}
                >
                  Strength: {strength.label}
                </p>
              )}
            </div>
          </div>

          {/* Animated Password Hints */}
          {password.length > 0 && (
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
            </div>
          )}

          {/* Confirm Password */}
          <div className="relative flex items-center bg-gray-100 rounded-md p-2">
            <Lock className="text-gray-500 mr-2" size={20} />
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm password"
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

          {/* Button with Loader */}
          <button
            disabled={isLoading}
            type="submit"
            className="flex justify-center items-center gap-2 bg-pink-500 hover:bg-pink-600 disabled:bg-pink-300 text-white font-medium px-4 py-2 rounded-md w-full transition"
          >
            {isLoading ? "Registering..." : "Register"}
            {isLoading && <Loader2 size={18} className="animate-spin" />}
          </button>
        </form>

        <div className="mt-2">
          <p>
            Already have an account?{" "}
            <Link
              to={redirect ? `/login?redirect=${redirect}` : "/login"}
              className="text-pink-500 hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>

      {/* Right side Banner */}
      <img
        src={signupBanner}
        alt="Sign up"
        className="h-124 w-[65%] mt-20 rounded-lg hidden lg:block"
      />
    </section>
  );
};

export default Register;
