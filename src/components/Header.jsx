import React from "react";
import { Funnel, Menu, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const Header = ({ isSidebarOpen, setIsSidebarOpen, buttonText, route }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Function to decide header title based on route
  const getHeaderTitle = () => {
    if (location.pathname === "/") return "Home";
    if (location.pathname.startsWith("/shop")) return "Shop";
    if (location.pathname.startsWith("/about")) return "About";
    if (location.pathname.startsWith("/contact")) return "Contact Us";
    if (location.pathname.startsWith("/event")) return "Events";
    if (location.pathname.startsWith("/ticket")) return "Ticket Details";

    if (location.pathname.startsWith("/dashboard")) {
      if (location.pathname === "/dashboard") return "Events";
      if (location.pathname.includes("shop")) return "Products";
      if (location.pathname.includes("create-product")) return "Create Product";
      if (location.pathname.includes("product/")) return "Product Details";
      if (location.pathname.includes("create-event")) return "Create Event";
      if (location.pathname.includes("create-ticket")) return "Create Ticket";
      if (location.pathname.includes("event/")) return "Event Details";
      return "Dashboard";
    }

    return "Page";
  };

  const handleNavigate = () => {
    navigate(route);
  };

  return (
    <div className="w-full top-0 relative p-0 m-0 bg-black">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-8 px-4 sm:pt-14 sm:px-5 gap-4">
        <div className="flex items-center justify-between w-full">
          {/* Dynamic Page Title */}
          <h1 className="font-bold text-xl sm:text-2xl md:text-[23px]">
            {getHeaderTitle()}
          </h1>

      
        </div>

        {/* Button on Right Side */}
        <div className="relative hidden md:block w-[280px]">
          <span className="absolute inset-0 bg-black rounded-lg translate-x-1.5 translate-y-1.5 border-2"></span>
          <button
            onClick={handleNavigate}
            className="relative w-[350px] sm:w-auto text-xs sm:text-sm md:text-base font-semibold uppercase cursor-pointer px-4 sm:px-6 py-2 sm:py-3 bg-white text-black rounded-lg border-2 border-black shadow-md scale-105 hover:scale-[1.03] transition-all duration-300"
          >
            {buttonText}
          </button>
        </div>
      </div>

      {/* Sub Header */}
      <div className="flex justify-between items-center pt-8 sm:pt-20 pb-4 px-4 sm:px-5 gap-3">
        <h1 className="text-[#E55934] text-sm sm:text-base md:text-lg">
          All {getHeaderTitle()}
        </h1>
        <div className="flex items-center gap-2 sm:gap-3 cursor-pointer">
          <Funnel size={18} />
          <h1 className="text-sm sm:text-base">Filter</h1>
        </div>
      </div>
    </div>
  );
};

export default Header;
