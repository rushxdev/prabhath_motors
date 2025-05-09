import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import { HiMenu } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../../context/AuthContext";

const Header: React.FC = () => {
  const [navOpen, setNavOpen] = useState(false);
  const [isServicesMenuOpen, setIsServicesMenuOpen] = useState(false);
  const [isAppointmentsMenuOpen, setIsAppointmentsMenuOpen] = useState(false);

  const { isLoggedIn, isAdmin, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleAppointmentsMenu = () => {
    if (isAppointmentsMenuOpen) {
      setIsAppointmentsMenuOpen(false);
    } else {
      setIsAppointmentsMenuOpen(true);
      setIsServicesMenuOpen(false); // Close services menu when appointments opens
    }
  };

  const toggleServicesMenu = () => {
    if (isServicesMenuOpen) {
      setIsServicesMenuOpen(false);
    } else {
      setIsServicesMenuOpen(true);
      setIsAppointmentsMenuOpen(false); // Close appointments menu when services opens
    }
  };

  const navLinks = [
    { to: "/about", label: "DISCOVER" },
    { to: "/services", label: "SERVICES" },
    { to: "/support", label: "SUPPORT" },
  ];

  // Animation variants for dropdown menus - changed to support absolute positioning
  const dropdownVariants = {
    hidden: {
      opacity: 0,
      y: -20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="relative">
      <header className="fixed top-0 inset-x-0 z-50 w-full shadow-md transition-colors duration-300">
        {/* Top Navigation */}
        <nav className="flex items-center px-6 py-4 bg-gray-100 dark:bg-black border-b border-gray-300 dark:border-gray-700 transition-colors duration-300">
          {/* Left - Logo */}
          <NavLink
            to="/"
            className="text-xl md:text-2xl font-bold dark:text-white"
          >
            <div className="md:w-25 mb-5 md:mb-0">
              <img src="../../../../public/assets/images/logo.png"/>
            </div>
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

            {/* Auth Buttons */}
            {isLoggedIn ? (
              <div className="hidden md:flex items-center space-x-4">
                <span className="font-medium text-gray-700 dark:text-gray-200">
                  {user?.username}
                </span>
                {isAdmin && (
                  <NavLink
                    to="/admin"
                    className="font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    ADMIN
                  </NavLink>
                )}
                <button
                  onClick={handleLogout}
                  className="font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  LOGOUT
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-4">
                <NavLink
                  to="/login"
                  className="font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  LOGIN
                </NavLink>
                <NavLink
                  to="/register"
                  className="font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  SIGNUP
                </NavLink>
              </div>
            )}

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
        <div className="bg-white border-b border-gray-300 transition-colors duration-300">
          <div className="flex justify-end px-9 py-3 container mx-auto">
            {/* Dropdown menus */}
            <div className="hidden md:flex space-x-6 mr-auto">
              {/* Appointments dropdown */}
              <div className="relative">
                <button
                  className="text-gray-700 dark:text-black hover:text-gray-900 dark:hover:text-gray-700 transition-colors flex items-center space-x-1"
                  onClick={toggleAppointmentsMenu}
                  onMouseEnter={() => {
                    setIsAppointmentsMenuOpen(true);
                    setIsServicesMenuOpen(false);
                  }}
                >
                  <span className="text-sm tracking-wider">APPOINTMENTS</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-4 w-4 transform transition-transform duration-200 ${isAppointmentsMenuOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="m6 9 6 6 6-6"
                    ></path>
                  </svg>
                </button>
              </div>

              {/* Service & Spare Parts dropdown */}
              <div className="relative">
                <button
                  className="text-gray-950 dark:text-black hover:text-gray-900 dark:hover:text-gray-700 transition-colors flex items-center space-x-1"
                  onClick={toggleServicesMenu}
                  onMouseEnter={() => {
                    setIsServicesMenuOpen(true);
                    setIsAppointmentsMenuOpen(false);
                  }}
                >
                  <span className="text-sm tracking-wider">SERVICE & SPARE PARTS</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-4 w-4 transform transition-transform duration-200 ${isServicesMenuOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="m6 9 6 6 6-6"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>

            {/* Mobile Menu Button (Secondary) */}
            <button className="text-gray-700 hover:text-gray-900">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Add this spacer to prevent content from being hidden under the fixed header */}
      <div className="h-[125px]"></div>

      {/* Appointments Menu - Change positioning to fixed instead of absolute */}
      <AnimatePresence>
        {isAppointmentsMenuOpen && (
          <motion.div
            className="fixed left-0 right-0 top-[125px] w-full bg-white border-b border-gray-200 z-40 shadow-lg"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={dropdownVariants}
            onMouseLeave={() => setIsAppointmentsMenuOpen(false)}
          >
            <div className="container mx-auto py-4 px-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-200">
                Appointment Options
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <a
                  href="/appointment/book"
                  className="group p-3 rounded-md transition-all duration-300 hover:bg-gray-50"
                >
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-800 mb-1 group-hover:text-green-600 transition-colors">
                      Book Appointment
                    </span>
                    <span className="text-sm text-gray-600">
                      Schedule a service appointment for your vehicle. Choose your preferred date, time, and service type.
                    </span>
                  </div>
                </a>

                <a
                  href="/appointment/status"
                  className="group p-3 rounded-md transition-all duration-300 hover:bg-gray-50"
                >
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-800 mb-1 group-hover:text-green-600 transition-colors">
                      Check Appointment Status
                    </span>
                    <span className="text-sm text-gray-600">
                      View details of your upcoming or past appointments, including service status and estimated completion time.
                    </span>
                  </div>
                </a>

                <a
                  href="/appointment/cancel"
                  className="group p-3 rounded-md transition-all duration-300 hover:bg-gray-50"
                >
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-800 mb-1 group-hover:text-green-600 transition-colors">
                      Cancel Appointment
                    </span>
                    <span className="text-sm text-gray-600">
                      Need to reschedule? Cancel your existing appointment and book a new time that works for you.
                    </span>
                  </div>
                </a>

                <a
                  href="/appointment/history"
                  className="group p-3 rounded-md transition-all duration-300 hover:bg-gray-50"
                >
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-800 mb-1 group-hover:text-green-600 transition-colors">
                      Service History
                    </span>
                    <span className="text-sm text-gray-600">
                      Review your vehicle's complete service history, including past appointments, repairs, and maintenance.
                    </span>
                  </div>
                </a>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  Questions? Contact our service center at <span className="font-medium text-gray-700">+94 123 456 789</span>
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Services Menu - Change positioning to fixed instead of absolute */}
      <AnimatePresence>
        {isServicesMenuOpen && (
          <motion.div
            className="fixed left-0 right-0 top-[125px] w-full bg-white border-b border-gray-200 z-40 shadow-lg"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={dropdownVariants}
            onMouseLeave={() => setIsServicesMenuOpen(false)}
          >
            <div className="container mx-auto py-4 px-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-200">
                Service & Spare Parts Options
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <a
                  href="/services/maintenance"
                  className="group p-3 rounded-md transition-all duration-300 hover:bg-gray-50"
                >
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-800 mb-1 group-hover:text-green-600 transition-colors">
                      Vehicle Maintenance
                    </span>
                    <span className="text-sm text-gray-600">
                      Regular maintenance services including oil changes, filter replacements, and comprehensive vehicle inspections.
                    </span>
                  </div>
                </a>

                <a
                  href="/services/repairs"
                  className="group p-3 rounded-md transition-all duration-300 hover:bg-gray-50"
                >
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-800 mb-1 group-hover:text-green-600 transition-colors">
                      Repairs & Diagnostics
                    </span>
                    <span className="text-sm text-gray-600">
                      Expert diagnosis and repair services for mechanical issues, electrical problems, and performance concerns.
                    </span>
                  </div>
                </a>

                <a
                  href="/services/body-shop"
                  className="group p-3 rounded-md transition-all duration-300 hover:bg-gray-50"
                >
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-800 mb-1 group-hover:text-green-600 transition-colors">
                      Body Shop & Painting
                    </span>
                    <span className="text-sm text-gray-600">
                      Professional body repair services, dent removal, and premium quality painting for accident damage or cosmetic enhancements.
                    </span>
                  </div>
                </a>

                <a
                  href="/services/parts-catalog"
                  className="group p-3 rounded-md transition-all duration-300 hover:bg-gray-50"
                >
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-800 mb-1 group-hover:text-green-600 transition-colors">
                      Spare Parts Catalog
                    </span>
                    <span className="text-sm text-gray-600">
                      Browse our extensive catalog of genuine and OEM parts for all major vehicle makes and models with competitive pricing.
                    </span>
                  </div>
                </a>

                <a
                  href="/services/accessories"
                  className="group p-3 rounded-md transition-all duration-300 hover:bg-gray-50"
                >
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-800 mb-1 group-hover:text-green-600 transition-colors">
                      Accessories & Upgrades
                    </span>
                    <span className="text-sm text-gray-600">
                      Enhance your vehicle with our selection of premium accessories, performance upgrades, and comfort features.
                    </span>
                  </div>
                </a>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  Need professional advice? Speak with our parts specialists at <span className="font-medium text-gray-700">+94 123 456 788</span>
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
              <div
                className="py-2 text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer"
                onClick={toggleAppointmentsMenu}
              >
                APPOINTMENTS
              </div>
              <div
                className="py-2 text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer"
                onClick={toggleServicesMenu}
              >
                SERVICE & SPARE PARTS
              </div>

              {/* Mobile Auth Links */}
              <div className="border-t dark:border-gray-700 mt-2 pt-2">
                {isLoggedIn ? (
                  <>
                    <div className="py-2 text-gray-700 dark:text-gray-200">
                      Logged in as: {user?.username}
                    </div>
                    {isAdmin && (
                      <NavLink
                        to="/admin"
                        className="block py-2 text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white transition-colors"
                        onClick={() => setNavOpen(false)}
                      >
                        ADMIN DASHBOARD
                      </NavLink>
                    )}
                    <div
                      className="py-2 text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer"
                      onClick={() => {
                        handleLogout();
                        setNavOpen(false);
                      }}
                    >
                      LOGOUT
                    </div>
                  </>
                ) : (
                  <>
                    <NavLink
                      to="/login"
                      className="block py-2 text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white transition-colors"
                      onClick={() => setNavOpen(false)}
                    >
                      LOGIN
                    </NavLink>
                    <NavLink
                      to="/register"
                      className="block py-2 text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white transition-colors"
                      onClick={() => setNavOpen(false)}
                    >
                      SIGNUP
                    </NavLink>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
