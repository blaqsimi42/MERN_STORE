import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  useLogoutMutation,
  useResendVerificationOtpMutation,
} from "../redux/api/usersApiSlice.js";
import { logout } from "../redux/features/auth/authSlice.js";
import {
  CgLogIn,
  CgShoppingCart,
  CgUserAdd,
  CgCheckO,
  CgCloseO,
} from "react-icons/cg";
import { toast } from "react-toastify";

const MobileTopBar = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [logoutApiCall] = useLogoutMutation();
  const [resendVerificationOtp, { isLoading: isResending }] =
    useResendVerificationOtpMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  const handleResendVerification = async () => {
    if (!userInfo?.email) return;
    try {
      const res = await resendVerificationOtp({
        email: userInfo.email,
      }).unwrap();
      toast.success(res.message || "Verification email resent successfully!");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to resend verification email");
    }
  };

  return (
    <div className="w-full flex justify-between items-center px-4 py-3 bg-black text-white shadow-md lg:hidden relative">
      {/* Logo Section */}
      <div className="text-xl font-bold flex gap-2">
        eXpress <CgShoppingCart className="text-pink-500 translate-y-1" />
      </div>

      {/* User Section */}
      {userInfo ? (
        <div className="relative flex items-center space-x-2">
          {/* ✅ User profile image beside the initial */}
          <img
            src={userInfo?.profileImage || "/images/default-profile.png"}
            alt="User Avatar"
            className="w-13 h-13 rounded-full border-2 border-pink-500 object-cover"
          />

          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center focus:outline-none group relative"
          >
            {/* User Capsule (Initial) */}
            <span
              title={userInfo.username}
              className="flex items-center justify-center uppercase text-white border-2 border-white rounded-full w-10 h-10 text-lg font-semibold cursor-pointer group-hover:bg-pink-500 transition-all duration-200 relative"
            >
              {userInfo.username?.charAt(0).toUpperCase()}

              {/* ✅ Verified / Unverified Badge beside avatar */}
              {userInfo.isVerified ? (
                <span
                  title="Verified Account"
                  className="absolute -right-2 -bottom-[1.5] bg-green-500 text-white text-[10px] font-semibold rounded-full flex items-center gap-[2px]"
                >
                  <CgCheckO size={17} />
                </span>
              ) : (
                <span
                  title="Unverified Account"
                  onClick={() => {
                    handleResendVerification();
                    navigate("/verify-otp");
                  }}
                  className="absolute -right-2 -bottom-[1.5] bg-red-600 text-white text-[10px] font-semibold rounded-full px-1.5 py-[1px] flex items-center gap-[2px] cursor-pointer hover:bg-red-700 transition"
                >
                  <p>!</p>
                </span>
              )}
            </span>

            {/* Dropdown Arrow */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-4 w-4 ml-1 text-white transition-transform duration-300 ${
                dropdownOpen ? "rotate-180" : ""
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={dropdownOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
              />
            </svg>
          </button>

          {/* Dropdown Menu */}
          <div
            className={`absolute right-0 top-[3.5rem] w-44 bg-[#1A1A1A] shadow-lg rounded-md text-white transform transition-all duration-300 z-[9999] ${
              dropdownOpen
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-2 pointer-events-none"
            }`}
          >
            <ul className="py-1">
              {!userInfo.isVerified && (
                <li
                  onClick={() => {
                    handleResendVerification();
                    navigate("/verify-otp");
                  }}
                  className={`flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:text-white hover:bg-red-600 cursor-pointer ${
                    isResending ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  <CgCloseO size={14} />
                  {isResending ? "Sending..." : "Verify Account"}
                </li>
              )}

              {userInfo.isAdmin && (
                <>
                  <li>
                    <NavLink
                      to="/admin/dashboard"
                      className="block px-4 py-2 hover:bg-gray-100 hover:text-black transition"
                    >
                      Dashboard
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/admin/createproduct"
                      className="block px-4 py-2 hover:bg-gray-100 hover:text-black transition"
                    >
                      Products
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/admin/categorylist"
                      className="block px-4 py-2 hover:bg-gray-100 hover:text-black transition"
                    >
                      Category
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/admin/orderlist"
                      className="block px-4 py-2 hover:bg-gray-100 hover:text-black transition"
                    >
                      Orders
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/admin/userlist"
                      className="block px-4 py-2 hover:bg-gray-100 hover:text-black transition"
                    >
                      Users
                    </NavLink>
                  </li>
                </>
              )}

              <li>
                <NavLink
                  to="/profile"
                  className="block px-4 py-2 hover:bg-gray-100 hover:text-black transition"
                >
                  Profile
                </NavLink>
              </li>
              <li>
                <button
                  onClick={logoutHandler}
                  className="w-full text-left block px-4 py-2 hover:bg-gray-100 hover:text-black transition"
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      ) : (
        // Show login/register if no user
        <div className="flex space-x-4">
          <NavLink
            to="/login"
            className="text-white hover:text-pink-500 transition"
          >
            <CgLogIn size={26} />
          </NavLink>
          <NavLink
            to="/register"
            className="text-white hover:text-pink-500 transition"
          >
            <CgUserAdd size={26} />
          </NavLink>
        </div>
      )}
    </div>
  );
};

export default MobileTopBar;
