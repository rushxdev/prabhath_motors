import React from "react";
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";

interface TopNavbarProps {
  username?: string;
}

const TopNavbar: React.FC<TopNavbarProps> = ({ username = "Admin User" }) => {
  return (
    <div className="bg-white dark:bg-black w-full flex justify-end items-center px-6 py-2">
      {/* User Profile Section */}
      <div className="flex items-center space-x-4">
        {/* User info */}
        <div className="flex items-center">
          <FaUserCircle className="h-6 w-6 text-green-600 mr-2" />
          <span className="font-medium text-gray-700 dark:text-gray-200">{username}</span>
        </div>
        
        {/* Divider */}
        <div className="h-6 border-r border-gray-300 dark:border-gray-700"></div>
        
        {/* Sign out button */}
        <button 
          onClick={() => console.log("Logout clicked")}
          className="flex items-center text-red-600 hover:text-red-700 transition-colors"
        >
          <FaSignOutAlt className="mr-1 h-4 w-4" />
          <span className="text-sm font-medium">Sign out</span>
        </button>
      </div>
    </div>
  );
};

export default TopNavbar;