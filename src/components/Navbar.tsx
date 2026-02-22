"use client";

import { useSidebarStore } from "@/context/sidebarStore";
import { Menu, X } from "lucide-react";
import Cookies from "js-cookie";
import { useEffect } from "react";

const Navbar = () => {
  const { isSidebarOpen, toggleSidebar } = useSidebarStore();

  useEffect(() => {
    if (!Cookies.get("api_key_merchant") && process.env.MERCHANT_API_KEY) {
      Cookies.set("api_key_merchant", process.env.MERCHANT_API_KEY);
    }
  }, []);

  return (
    <div
      style={{ zIndex: "999" }}
      className="fixed top-0 left-0 w-full h-16 bg-[#1C1F2D] text-white py-2 px-4 font-quantico flex justify-between items-center z-50 border-b border-[#474F71]"
    >
      {/* Left side - Hamburger menu */}
      <div className="flex items-center">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md hover:bg-gray-700 transition-colors duration-200 mr-4"
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <h1 className="text-2xl font-bold">USER DASHBOARD</h1>
      </div>

      {/* Right side - Wallet button */}
      <div>
        {/* {isConnected ? (
          <button
            className="w-[180px] sm:w-[210px] bg-[#2979FF] cursor-pointer text-sm sm:text-lg font-semibold text-white border-black/20 px-4 sm:px-6 py-2 rounded-md hover:bg-[#29adff] transition-colors duration-200"
            onClick={disconnectWallet}
          >
            Disconnect Wallet
          </button>
        ) : (
          <button
            className="w-[180px] sm:w-[210px] bg-[#2979FF] cursor-pointer text-sm sm:text-lg font-semibold text-white border-black/20 px-4 sm:px-6 py-2 rounded-md hover:bg-[#29adff] transition-colors duration-200"
            onClick={connectWallet}
          >
            Connect Wallet
          </button>
        )} */}
      </div>
    </div>
  );
};

export default Navbar;
