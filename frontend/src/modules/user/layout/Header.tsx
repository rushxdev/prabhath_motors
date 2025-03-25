import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import { HiMenu } from "react-icons/hi";

const Header: React.FC = () => {
  const [navOpen, setNavOpen] = useState(false);
  const [isServicesMenuOpen, setIsServicesMenuOpen] = useState(false);
  const [isAppointmentsMenuOpen, setIsAppointmentsMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);


  const toggleAppointmentsMenu = () => {
    setIsAppointmentsMenuOpen(!isAppointmentsMenuOpen);
    if (isServicesMenuOpen) setIsServicesMenuOpen(false);
  };

  const toggleServicesMenu = () => {
    setIsServicesMenuOpen(!isServicesMenuOpen);
    if (isAppointmentsMenuOpen) setIsAppointmentsMenuOpen(false);
  };

  const navLinks = [
    { to: "/discover", label: "DISCOVER" },
    { to: "/services", label: "SERVICES" },
    { to: "/support", label: "SUPPORT" },
  ];

  return (
    <header className="sticky top-0 inset-x-0 z-50 w-full shadow-sm transition-colors duration-300">
      {/* Top Navigation */}
      <nav className="flex items-center px-6 py-4 bg-gray-100 dark:bg-gray-900 border-b border-gray-300 dark:border-gray-700 transition-colors duration-300">
        {/* Left - Logo */}
        <NavLink to="/" className="text-xl md:text-2xl font-bold dark:text-white">
          LOGO
        </NavLink>

        {/* Left - Navigation Links */}
        <div className="hidden md:flex space-x-6 ml-8">
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className="font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              {label}
            </NavLink>
          ))}
        </div>

        {/* Right - Theme Toggle, Search & Signup */}
        <div className="flex items-center space-x-4 ml-auto">
          
          {/* Search Icon */}
          <button className="text-gray-700 dark:text-white hover:text-gray-900 dark:hover:text-gray-300">
            <FiSearch size={18} />
          </button>

          {/* Signup Button */}
          <NavLink to="/signup" className="hidden md:block font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white transition-colors">
            SIGNUP
          </NavLink>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-gray-700 dark:text-white hover:text-gray-900 dark:hover:text-gray-300" 
            onClick={() => setNavOpen(!navOpen)}
          >
            <HiMenu size={22} />
          </button>
        </div>
      </nav>

      {/* Secondary Navigation */}
      <div className="flex justify-end px-9 py-3 bg-white border-b border-gray-300 transition-colors duration-300">
        {/* Dropdown menus */}
        <div className="hidden md:flex space-x-6 mr-auto">
          {/* Appointments dropdown */}
          <div className="relative">
            <button 
              className="text-gray-700 dark:text-black hover:text-gray-900 dark:hover:text-white transition-colors flex items-center space-x-1"
              onClick={toggleAppointmentsMenu}
            >
              <span className="font-medium">APPOINTMENTS</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m6 9 6 6 6-6"></path>
              </svg>
            </button>
            
            {isAppointmentsMenuOpen && (
              <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 shadow-md rounded-md p-2 w-48 z-10 border dark:border-gray-700">
                <ul>
                  <li><a href="#" className="block px-3 py-2 rounded hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700 transition-colors">Book Appointment</a></li>
                  <li><a href="#" className="block px-3 py-2 rounded hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700 transition-colors">Check Status</a></li>
                  <li><a href="#" className="block px-3 py-2 rounded hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700 transition-colors">Cancel Appointment</a></li>
                </ul>
              </div>
            )}
          </div>
          
          {/* Service & Spare Parts dropdown */}
          <div className="relative">
            <button 
              className="text-gray-950 dark:text-black hover:text-gray-900 dark:hover:text-white transition-colors flex items-center space-x-1"
              onClick={toggleServicesMenu}
            >
              <span className="font-medium">SERVICE & SPARE PARTS</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m6 9 6 6 6-6"></path>
              </svg>
            </button>
            
            {isServicesMenuOpen && (
              <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 shadow-md rounded-md p-2 w-48 z-10 border dark:border-gray-700">
                <ul>
                  <li><a href="#" className="block px-3 py-2 rounded hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700 transition-colors">Maintenance</a></li>
                  <li><a href="#" className="block px-3 py-2 rounded hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700 transition-colors">Repairs</a></li>
                  <li><a href="#" className="block px-3 py-2 rounded hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700 transition-colors">Spare Parts Catalog</a></li>
                </ul>
              </div>
            )}
          </div>
        </div>
        
        {/* Mobile Menu Button (Secondary) */}
        <button className="text-gray-700 hover:text-gray-900">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {navOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 border-b dark:border-gray-700 transition-colors duration-300">
          <div className="px-4 py-2">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className="block py-2 text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white transition-colors"
                onClick={() => setNavOpen(false)}
              >
                {label}
              </NavLink>
            ))}
            <div className="py-2 border-t dark:border-gray-700 mt-2">
              <div className="py-2 text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer">
                APPOINTMENTS
              </div>
              <div className="py-2 text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer">
                SERVICE & SPARE PARTS
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;