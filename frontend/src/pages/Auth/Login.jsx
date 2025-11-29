import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLoginMutation } from "../../redux/api/usersApiSlice";
import { setCredientials } from "../../redux/features/auth/authSlice";
import { toast } from "react-toastify";
import LoginBanner from "../../assets/LoginBanner.jpg";
import { Mail, Lock, Eye, EyeOff, CheckCircle, Loader2 } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  // ✅ Password rules
  const passwordRules = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    symbol: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  // ✅ Strength logic
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

  const isPasswordValid = Object.values(passwordRules).every(Boolean);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!isPasswordValid) {
      toast.error(
        "Password must be at least 8 characters, include uppercase, lowercase, number, and symbol!"
      );
      return;
    }

    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredientials({ ...res }));
      toast.success("User successfully logged in");
    } catch (error) {
      toast.error(error?.data?.message || error.message);
    }
  };

  return (
    <section className="flex flex-wrap gap-8 px-10 ml-[1rem] md:ml-[0rem] lg:ml-[6rem] md:justify-center">
      {/* Left Form */}
      <div className="mt-[6rem] mb-4 w-[20rem]">
        <h1 className="text-2xl font-semibold">Sign In</h1>

        <form onSubmit={submitHandler} className="mt-6 space-y-6">
          {/* Email */}
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

          {/* Password */}
          <div className="relative flex flex-col bg-gray-100 rounded-md p-2">
            <div className="flex items-center">
              <Lock className="text-gray-500 mr-2" size={20} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-gray-100 w-full text-black border-none focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="ml-2 text-gray-500"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* ✅ Password Strength Bar */}
            {password.length > 0 && (
              <div className="mt-2 px-2">
                <div className="w-full h-2 bg-gray-300 rounded-full overflow-hidden">
                  <div
                    className={`h-2 rounded-full ${strength.color} ${strength.width} transition-all duration-500`}
                  ></div>
                </div>
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
              </div>
            )}
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

          {/* Button with Loader */}
          <button
            disabled={isLoading}
            type="submit"
            className="flex justify-center items-center gap-2 bg-pink-500 hover:bg-pink-600 disabled:bg-pink-300 text-white font-medium px-4 py-2 rounded-md my-4 w-full transition"
          >
            {isLoading ? "Signing In..." : "Sign In"}
            {isLoading && <Loader2 size={18} className="animate-spin" />}
          </button>
        </form>

        {/* Register + Forgot Password */}
        <div className="mt-4 flex justify-between items-center">
          <p>
            New Customer?{" "}
            <Link
              to={redirect ? `/register?redirect=${redirect}` : "/register"}
              className="text-pink-500 hover:underline"
            >
              Register
            </Link>
          </p>

          <Link
            to="/forgot-password"
            className="text-pink-500 hover:underline text-sm"
          >
            Forgot Password?
          </Link>
        </div>
      </div>

      {/* Right side: Banner */}
      <img
        src={LoginBanner}
        alt="Login banner"
        className="hidden lg:block h-[30rem] w-[63%] object-cover mt-20 rounded-lg"
      />
    </section>
  );
};

export default Login;
