import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { setCredientials } from "../../redux/features/auth/authSlice";
import {
  useProfileMutation,
  useUploadProfileImageMutation,
} from "../../redux/api/usersApiSlice";
import Loader from "../../components/Loader";
import { CheckCircle, Eye, EyeOff } from "lucide-react";

const Profile = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [imageUrl, setImageUrl] = useState("/images/default-profile.png");
  const [isFullImageOpen, setIsFullImageOpen] = useState(false);

  const [updateProfile, { isLoading: loadingUpdateProfile }] =
    useProfileMutation();
  const [uploadProfileImage, { isLoading: loadingUpload }] =
    useUploadProfileImageMutation();

  // Initialize form and image from userInfo
  useEffect(() => {
    if (userInfo) {
      setUsername(userInfo.username);
      setEmail(userInfo.email);
      setImageUrl(userInfo.profileImage || "/images/default-profile.png");
    }
  }, [userInfo]);

  // ✅ Password validation rules
  const passwordRules = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    symbol: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const isPasswordValid = Object.values(passwordRules).every(Boolean);
  const doPasswordsMatch = password === confirmPassword;

  // ✅ Calculate password strength
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

  // Handle profile info update
  const submitHandler = async (e) => {
    e.preventDefault();

    if (password && !isPasswordValid) {
      toast.error(
        "Password must be at least 8 characters, include uppercase, lowercase, number, and symbol."
      );
      return;
    }

    if (password && password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const updatedData = {
        _id: userInfo._id,
        username,
        email,
        password: password || undefined,
        profileImage: imageUrl,
      };

      const res = await updateProfile(updatedData).unwrap();
      dispatch(setCredientials({ ...userInfo, ...res }));
      toast.success("Profile updated successfully");
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast.error(error?.data?.message || error.message);
    }
  };

  // Handle profile image upload
  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageUrl(URL.createObjectURL(file));
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await uploadProfileImage(formData).unwrap();
      dispatch(setCredientials({ ...userInfo, profileImage: res.image }));
      setImageUrl(res.image);
      toast.success("Profile image updated successfully");
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  return (
    <div className="container mx-auto p-4 mt-[3rem]">
      <div className="flex justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl w-full items-start">
          {/* Left: Profile Image */}
          <div className="ml-[0rem] flex justify-center lg:justify-start mb-4 lg:mb-0">
            <div className="flex flex-col items-center mt-[1rem] md:mt-[4rem] relative">
              <div
                className="relative group cursor-pointer"
                onClick={() => setIsFullImageOpen(true)}
              >
                <img
                  src={imageUrl || "/images/default-profile.png"}
                  alt="Profile"
                  className="w-52 h-52 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-full object-cover border-4 border-pink-500 transition-transform duration-200 group-hover:scale-[1.02]"
                />

                <div className="absolute inset-0 flex items-center justify-center bg-black/80 bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-all">
                  <span className="text-white bg-pink-500 px-3 py-1 rounded-lg text-sm font-semibold">
                    View
                  </span>
                </div>

                <div className="absolute bottom-2 right-2 bg-black/90 text-white text-xs px-2 py-1 rounded-md">
                  {userInfo?.isVerified ? (
                    <span className="text-green-400 font-semibold">
                      ✔ Verified
                    </span>
                  ) : (
                    <span className="text-red-400 font-semibold">
                      ! Not Verified
                    </span>
                  )}
                </div>
              </div>

              <label className="mt-4 px-6 py-3 bg-pink-500 text-white rounded-lg cursor-pointer hover:bg-pink-600 transition-all">
                Change Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={uploadFileHandler}
                  className="hidden"
                />
              </label>
              {loadingUpload && <Loader />}
            </div>
          </div>

          {/* Right: Form */}
          <div className="w-full bg-[#121212] p-6 rounded-lg shadow-lg border border-gray-700">
            <h2 className="text-2xl font-semibold mb-4 text-pink-500 text-center lg:text-left">
              Update Profile
            </h2>

            <form onSubmit={submitHandler} className="space-y-4">
              <div>
                <label className="block text-white mb-2">Username</label>
                <input
                  type="text"
                  placeholder="Enter Username"
                  className="w-full p-3 rounded bg-black/90 text-white focus:outline-none focus:ring-2 focus:ring-pink-400"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-white mb-2">Email</label>
                <input
                  type="email"
                  placeholder="Enter Email"
                  className="w-full p-3 rounded bg-black/90 text-white focus:outline-none focus:ring-2 focus:ring-pink-400"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* Password with eye toggle */}
              <div className="relative">
                <label className="block text-white mb-2">Password</label>
                <div className="flex items-center bg-black/90 rounded focus-within:ring-2 focus-within:ring-pink-400">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter Password"
                    className="w-full p-3 rounded-l bg-black/90 text-white focus:outline-none border-none"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="px-3 text-gray-400 hover:text-pink-400"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                {/* ✅ Password strength bar */}
                {password.length > 0 && (
                  <div className="mt-2">
                    <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`h-2 rounded-full ${strength.color} ${strength.width} transition-all duration-500`}
                      ></div>
                    </div>
                    <p
                      className={`text-sm mt-1 transition-colors ${
                        strength.label === "Weak"
                          ? "text-red-400"
                          : strength.label === "Medium"
                          ? "text-yellow-400"
                          : "text-green-400"
                      }`}
                    >
                      Strength: {strength.label}
                    </p>
                  </div>
                )}
              </div>

              {/* ✅ Animated Password Hints */}
              {password.length > 0 && (
                <div className="text-sm mb-2 space-y-1 animate-fade-in">
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
                        className={`flex items-center gap-1 transition-all duration-300 transform ${
                          valid ? "scale-105" : "scale-100"
                        }`}
                      >
                        <CheckCircle
                          size={16}
                          className={`transition-colors duration-300 ${
                            valid ? "text-green-400" : "text-red-400"
                          }`}
                        />
                        <span
                          className={`${
                            valid ? "text-green-400" : "text-red-400"
                          }`}
                        >
                          {hintText}
                        </span>
                      </div>
                    );
                  })}

                  {!doPasswordsMatch && confirmPassword.length > 0 && (
                    <div className="flex items-center gap-1 text-red-400 animate-fade-in">
                      <CheckCircle size={16} className="scale-100" />
                      <span>Passwords do not match</span>
                    </div>
                  )}
                </div>
              )}

              {/* Confirm Password with eye toggle */}
              <div className="relative">
                <label className="block text-white mb-2">
                  Confirm Password
                </label>
                <div className="flex items-center bg-black/90 rounded focus-within:ring-2 focus-within:ring-pink-400">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Re-enter Password"
                    className="w-full p-3 rounded-l bg-black/90 text-white focus:outline-none border-none"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="px-3 text-gray-400 hover:text-pink-400"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-between gap-3">
                <button
                  type="submit"
                  className="bg-pink-500 text-white py-2 px-4 rounded font-semibold hover:bg-pink-600 transition-all ease-in-out"
                >
                  Update
                </button>

                <Link
                  to="/user-orders"
                  className="bg-pink-600 text-white py-2 px-4 rounded text-center font-semibold hover:bg-pink-700 transition-all ease-in-out"
                >
                  My Orders
                </Link>
              </div>
            </form>

            {loadingUpdateProfile && (
              <div className="flex justify-center mt-4">
                <Loader />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Full Image View Modal */}
      {isFullImageOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
          <div className="relative">
            <button
              onClick={() => setIsFullImageOpen(false)}
              className="absolute top-2 right-2 bg-pink-600 text-white text-lg font-bold px-3 py-1 rounded-full hover:bg-pink-700 transition-all"
            >
              ✕
            </button>
            <img
              src={imageUrl || "/images/default-profile.png"}
              alt="Full Profile"
              className="max-w-[90vw] max-h-[85vh] rounded-lg object-contain border-4 border-pink-500"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
