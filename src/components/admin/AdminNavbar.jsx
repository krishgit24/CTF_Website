import React, { useState } from "react";
import { Link, useLocation } from "react-router";
import { LayoutDashboard, Bell, User, Menu, X } from "lucide-react";

export const NAVIGATION = [
  { name: "Leaderboard", path: "/" },
  { name: "Logs", path: "/logs" },
];

const Navbar = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-100">
      <div className="flex justify-between items-center px-4 sm:px-6 py-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
            <LayoutDashboard className="w-5 h-5 text-white" />
          </div>
          <span className="font-semibold text-gray-800">CTF Platform</span>
        </div>

        {/* Desktop Navigation Links */}
        <ul className="hidden md:flex gap-1 items-center">
          {NAVIGATION.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                    ${isActive
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 hover:bg-gray-100"}
                  `}
                >
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Right side - Notification & Profile */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Notification Bell */}
          <button className="relative p-2 text-gray-500 hover:text-gray-700 transition-colors">
            <Bell className="w-5 h-5" />
          </button>

          {/* Profile Avatar */}
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center overflow-hidden cursor-pointer">
            <User className="w-5 h-5 text-white" />
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-500 hover:text-gray-700 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <ul className="flex flex-col py-2">
            {NAVIGATION.map((item) => {
              const isActive = location.pathname === item.path;

              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block px-6 py-3 text-sm font-medium transition-all duration-200
                      ${isActive
                        ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600"
                        : "text-gray-600 hover:bg-gray-50"}
                    `}
                  >
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
