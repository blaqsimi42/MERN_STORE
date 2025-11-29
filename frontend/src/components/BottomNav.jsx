import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { CgHome, CgShoppingBag, CgShoppingCart, CgHeart } from "react-icons/cg";
import { useSelector } from "react-redux";
import FavoritesCount from "../pages/Products/FavoritesCountBottom.jsx";

const BottomNav = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const [showNav, setShowNav] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // 👇 Auto-hide on scroll down / show on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        // scrolling down
        setShowNav(false);
      } else {
        // scrolling up
        setShowNav(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <>
      {/*
        ✅ Bottom Navigation
        - Visible ONLY on mobile and tablet (hidden on desktop)
        - Auto-hides on scroll down, reappears on scroll up
        - Smooth transitions + bounce/scale on tap
      */}
      <nav
        className={`
          fixed bottom-0 left-0 right-0
          bg-[#111]/70 backdrop-blur-md border-t border-gray-800
          flex justify-around items-center py-3
          z-[1000] 
           md:flex lg:hidden
          transition-transform duration-500 ease-in-out
          ${showNav ? "translate-y-0" : "translate-y-[100%]"}
        `}
      >
        {/* HOME */}
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex flex-col items-center text-sm transition-all duration-200 active:scale-110 active:animate-bounce ${
              isActive ? "text-pink-500" : "text-gray-300"
            }`
          }
        >
          <CgHome size={26} className="transition-transform duration-200" />
          <span className="text-[12px] mt-1">Home</span>
        </NavLink>

        {/* SHOP */}
        <NavLink
          to="/shop"
          className={({ isActive }) =>
            `flex flex-col items-center text-sm transition-all duration-200 active:scale-110 active:animate-bounce ${
              isActive ? "text-pink-500" : "text-gray-300"
            }`
          }
        >
          <CgShoppingBag
            size={26}
            className="transition-transform duration-200"
          />
          <span className="text-[12px] mt-1">Shop</span>
        </NavLink>

        {/* CART */}
        <div className="relative">
          <NavLink
            to="/cart"
            className={({ isActive }) =>
              `flex flex-col items-center text-sm transition-all duration-200 active:scale-110 active:animate-bounce ${
                isActive ? "text-pink-500" : "text-gray-300"
              }`
            }
          >
            <CgShoppingCart
              size={26}
              className="transition-transform duration-200"
            />
            <span className="text-[12px] mt-1">Cart</span>
          </NavLink>

          {/* Cart badge */}
          {cartItems.length > 0 && (
            <span className="absolute -top-1 -right-2 bg-pink-500 text-white text-[10px] px-1.5 rounded-full">
              <div className="text-[13px]">
                {cartItems.reduce((acc, item) => acc + Number(item.qty), 0)}
              </div>
            </span>
          )}
        </div>

        {/* FAVORITES */}
        <div className="relative">
          <NavLink
            to="/favorite"
            className={({ isActive }) =>
              `flex flex-col items-center text-sm transition-all duration-200 active:scale-110 active:animate-bounce ${
                isActive ? "text-pink-500" : "text-gray-300"
              }`
            }
          >
            <CgHeart size={26} className="transition-transform duration-200" />
            <span className="text-[12px] mt-1">Fav</span>
          </NavLink>
          <div className="">
            <FavoritesCount />
          </div>
        </div>
      </nav>
    </>
  );
};

export default BottomNav;
