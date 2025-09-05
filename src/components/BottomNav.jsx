import React from "react";
import { Home, ScanLine } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const BottomNav = () => {
  const { pathname } = useLocation();

  const navItem = (to, Icon, label) => {
    const active = pathname === to;
    return (
      <Link
        to={to}
        className={`flex flex-col items-center gap-1 px-6 py-2 ${
          active ? "text-[#E55934] font-semibold" : "text-gray-400"
        }`}
      >
        <Icon size={22} />
        <span className="text-xs">{label}</span>
      </Link>
    );
  };

  return (
    <div
      className="
        fixed bottom-0 left-0 right-0
        flex justify-around gap-10
        bg-black/80 backdrop-blur-md
         shadow-lg
        z-20
      "
    >
      {navItem("/", Home, "Home")}
      {navItem("/scan", ScanLine, "Scan")}
    </div>
  );
};

export default BottomNav;
