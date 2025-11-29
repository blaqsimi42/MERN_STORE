import React from "react";
import { Outlet } from "react-router-dom";
import Navigation from "./pages/Auth/Navigation";
import BottomNav from "./components/BottomNav.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css"; 
import MobileTopBar from "./components/MobileTopBar.jsx";

function App() {
  return (
    <>
      {/* Toast notifications */}
      <ToastContainer />

      {/* Desktop/Tablet Sidebar Navigation */}
      <Navigation />

      {/* Main Page Content */}
      <main className="py-3 min-h-screen bg-[#111] text-white">
        <Outlet />
      </main>

      {/* ✅ Global Bottom Navigation */}
      {/* This shows ONLY on mobile and tablets — not on desktop */}
      <div className="block lg:hidden">
        <BottomNav />
      </div>
    </>
  );
}

export default App;
