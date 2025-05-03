import React from "react";
import { useNavigate } from "react-router-dom";

const AppointNav: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="appointnav container mx-auto bg-black text-white text-center py-5">
      <div className="grid grid-cols-4 gap-4">
        {/* 1st button */}
        <div
          className="text-center space-y-2 cursor-pointer hover:bg-gray-800 p-2 rounded"
          onClick={() => navigate("/admin/appointment-list")}
        >
          <p className="uppercase tracking-wide text-xs">Appointments</p>
        </div>

        {/* 2nd button */}
        <div
          className="text-center space-y-2 cursor-pointer hover:bg-gray-800 p-2 rounded"
          onClick={() => navigate("/admin/task-list")}
        >
          <p className="uppercase tracking-wide text-xs">Tasks</p>
        </div>
      </div>
    </div>
  );
};

export default AppointNav;
