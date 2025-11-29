import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Navigation.css";
import { useSelector, useDispatch } from "react-redux";
import {
  useLogoutMutation,
  useResendVerificationOtpMutation,
} from "../../redux/api/usersApiSlice.js";
import { logout } from "../../redux/features/auth/authSlice.js";
import FavoritesCount from "../Products/FavoritesCount.jsx";
import MobileTopBar from "../../components/MobileTopBar.jsx";
import {
  CgCheck,
  CgHeart,
  CgHome,
  CgLogIn,
  CgShoppingBag,
  CgShoppingCart,
  CgUserAdd,
} from "react-icons/cg";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { toast } from "react-toastify";

const Navigation = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

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
    <>
      {/* 👇 Mobile top bar */}
      <div className="block lg:hidden">
        <MobileTopBar />
      </div>

      {/* 👇 Desktop sidebar */}
      <div
        style={{ zIndex: 999 }}
        onMouseLeave={() => {
          setDropdownOpen(false);
          setShowTooltip(false);
        }}
        className={`${
          showSidebar ? "hidden" : "flex"
        } xl:flex lg:flex hidden flex-col justify-between p-4 text-white bg-black w-[6%] hover:w-[15%] h-[100vh] fixed`}
        id="navigation-container"
      >
        {/* TOP NAV LINKS */}
        <div className="flex flex-col justify-center space-y-4">
          <NavLink
            style={({ isActive }) => ({
              color: isActive ? "#ffffff" : "white",
            })}
            to="/"
            className="flex items-center transition-transform transform"
          >
            <span className="hidden nav-item-name mt-3 mr-[1rem] text-[23px]">
              <div className="flex gap-2 font-semibold">
                eXpress{" "}
                <CgShoppingCart className="text-pink-500 translate-y-2" />
              </div>
            </span>
          </NavLink>

          <NavLink
            style={({ isActive }) => ({
              color: isActive ? "#ec4899" : "white",
            })}
            to="/"
            className="flex items-center transition-transform transform hover:translate-x-2 hover:text-pink-500 "
          >
            <CgHome className="mr-2 mt-[3rem]" size={26} />
            <span className="hidden nav-item-name mt-[3rem]">Home</span>
          </NavLink>

          <NavLink
            style={({ isActive }) => ({
              color: isActive ? "#ec4899" : "white",
            })}
            to="/shop"
            className="flex items-center transition-transform transform hover:translate-x-2 hover:text-pink-500"
          >
            <CgShoppingBag className="mr-2 mt-[3rem]" size={26} />
            <span className="hidden nav-item-name mt-[3rem]">Shop</span>
          </NavLink>

          <div className="relative">
            <NavLink
              style={({ isActive }) => ({
                color: isActive ? "#ec4899" : "white",
              })}
              to="/cart"
              className="flex items-center transition-transform transform hover:translate-x-2 hover:text-pink-500"
            >
              <CgShoppingCart className="mr-2 mt-[3rem]" size={26} />
              <span className="hidden nav-item-name mt-[3rem]">Cart</span>
              <div className="absolute top-9">
                {cartItems.length > 0 && (
                  <span className="px-1 py-0 text-white text-sm bg-pink-500 rounded-full ml-4">
                    {cartItems.reduce((acc, item) => acc + Number(item.qty), 0)}
                  </span>
                )}
              </div>
            </NavLink>
          </div>

          <div className="relative">
            <NavLink
              style={({ isActive }) => ({
                color: isActive ? "#ec4899" : "white",
              })}
              to="/favorite"
              className="flex items-center transition-transform transform hover:translate-x-2 hover:text-pink-500"
            >
              <div className="mt-[3rem]">
                <CgHeart size={26} />
                <FavoritesCount />
              </div>
              <span className="hidden nav-item-name mt-[3rem] ml-2">
                Favorites
              </span>
            </NavLink>
          </div>
        </div>

        {/* USER DROPDOWN */}
        <div className="relative">
          {userInfo && (
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              className="relative flex flex-col items-center focus:outline-none group"
            >
              {/* ✅ Profile Picture Above Initial */}
              <div className="flex flex-col items-center mb-1 mr-0 lg:mr-4">
                {userInfo.profileImage ? (
                  <img
                    src={userInfo.profileImage}
                    alt="User profile"
                    className="w-12 h-12 rounded-full border-2 border-pink-500 object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center w-12 h-12 bg-gray-700 border-2 border-pink-500 rounded-full text-white font-semibold text-lg">
                    {userInfo.username?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              {/* Username Initial + External Arrow */}
              <div className="relative flex items-center justify-center mt-1">
                {/* Circle */}
                <span
                  title={userInfo.username}
                  className="flex items-center justify-center text-white border-2 border-white rounded-full w-10 h-10 text-lg font-semibold cursor-pointer group-hover:bg-pink-500 transition-all duration-200 relative"
                >
                  {userInfo.username?.charAt(0).toUpperCase()}

                  {/* ✅ Verified / Unverified Badge */}
                  {userInfo.isVerified ? (
                    <span
                      title="Verified Account"
                      className="absolute -right-2 -bottom-[-5] bg-green-500 text-white text-[10px] font-semibold rounded-full flex items-center gap-[2px]"
                    >
                      <CgCheck size={18} />
                    </span>
                  ) : (
                    <span
                      title="Unverified Account"
                      onClick={() => {
                        handleResendVerification();
                        navigate("/verify-otp");
                      }}
                      className="absolute -right-2 -bottom-[-5] bg-red-600 text-white text-[10px] font-semibold px-1.5 py-[1px] rounded-full flex items-center gap-[2px] cursor-pointer hover:bg-red-700 transition"
                    >
                      !
                    </span>
                  )}
                </span>

                {/* ▼ Arrow Outside the Circle (visible on hover) */}
                <span
                  className={`ml-2 transition-opacity duration-300 ${
                    showTooltip ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-4 w-4 text-white transition-transform ${
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
                </span>
              </div>

              {/* ✨ Tooltip with user details */}
              {showTooltip && (
                <div className="absolute bottom-16 right-[-6rem] bg-[#1a1a1a] border border-gray-700 text-white text-sm rounded-lg shadow-lg px-3 py-2 w-40 transition-all duration-300 mb-[2.2rem]">
                  <p className="font-semibold text-pink-400 truncate">
                    {userInfo.username}
                  </p>
                  <p className="text-gray-400 text-xs truncate">
                    {userInfo.email}
                  </p>
                </div>
              )}
            </button>
          )}

          {dropdownOpen && userInfo && (
            <ul className="absolute bg-[#1A1A1A] shadow-lg rounded-md text-white w-40 right-0 -top-2 translate-y-[-100%]">
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
                  <AiOutlineExclamationCircle size={16} />
                  {isResending ? "Sending..." : "Verify Account"}
                </li>
              )}

              {userInfo.isAdmin && (
                <>
                  <li>
                    <NavLink
                      to="/admin/dashboard"
                      className="block px-4 py-2 hover:bg-gray-100 hover:text-black"
                    >
                      Dashboard
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/admin/createproduct"
                      className="block px-4 py-2 hover:bg-gray-100 hover:text-black"
                    >
                      Create product
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/admin/categorylist"
                      className="block px-4 py-2 hover:bg-gray-100 hover:text-black"
                    >
                      Categories
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/admin/orderlist"
                      className="block px-4 py-2 hover:bg-gray-100 hover:text-black"
                    >
                      Manage orders
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/admin/userlist"
                      className="block px-4 py-2 hover:bg-gray-100 hover:text-black"
                    >
                      Manage users
                    </NavLink>
                  </li>
                </>
              )}

              <li>
                <NavLink
                  to="/profile"
                  className="block px-4 py-2 hover:bg-gray-100 hover:text-black"
                >
                  Profile
                </NavLink>
              </li>

              <li>
                <button
                  onClick={logoutHandler}
                  className="w-full text-left block px-4 py-2 hover:bg-gray-100 hover:text-black"
                >
                  Logout
                </button>
              </li>
            </ul>
          )}
        </div>

        {/* LOGIN / REGISTER LINKS */}
        {!userInfo && (
          <ul>
            <li>
              <NavLink
                style={({ isActive }) => ({
                  color: isActive ? "#ec4899" : "white",
                })}
                to="/login"
                className="flex items-center transition-transform transform hover:translate-x-2 hover:text-pink-500"
              >
                <CgLogIn className="mr-2 mt-[3rem]" size={26} />
                <span className="hidden nav-item-name mt-[3rem]">Login</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                style={({ isActive }) => ({
                  color: isActive ? "#ec4899" : "white",
                })}
                to="/register"
                className="flex items-center transition-transform transform hover:translate-x-2 hover:text-pink-500"
              >
                <CgUserAdd className="mr-2 mt-[3rem]" size={26} />
                <span className="hidden nav-item-name mt-[3rem]">Register</span>
              </NavLink>
            </li>
          </ul>
        )}
      </div>
    </>
  );
};

export default Navigation;
