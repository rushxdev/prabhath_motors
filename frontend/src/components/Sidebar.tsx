import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaCar, FaAddressBook, FaBriefcase, FaCartPlus, FaChartLine, FaSignOutAlt, FaBars } from "react-icons/fa";

interface MenuItem {
  title: string;
  icon: React.ReactNode;
  href: string;
}

const Sidebar: React.FC = () => {
  const [open, setOpen] = useState<boolean>(() => {
    const savedState = localStorage.getItem('sidebarState');
    return savedState ? JSON.parse(savedState) : true;
  });
  const location = useLocation();

  useEffect(() => {
    localStorage.setItem('sidebarState', JSON.stringify(open));
  }, [open]);

  const Menus: MenuItem[] = [
    { title: "Vehicle", icon: <FaCar size={24} />, href: "/admin/vehicle" },
    { title: "Appointment", icon: <FaAddressBook size={24} />, href: "/admin/appointment" },
    { title: "Employee", icon: <FaBriefcase size={24} />, href: "/admin/employee/add" },
    { title: "Stock", icon: <FaCartPlus size={24} />, href: "/admin/items" },
    { title: "Utilities", icon: <FaChartLine size={24} />, href: "/admin/utility" },
    { title: "LogOut", icon: <FaSignOutAlt size={24} />, href: "/admin/logout" },
  ];

  const toggleSidebar = () => {
    setOpen(!open);
  };

  return (
    <div className="fixed inset-y-0 left-0 z-50">
      <div
        className={`${
          open ? "w-72" : "w-20"
        } h-full bg-black text-white transition-all duration-300 flex flex-col`}
      >
        {/* Sidebar Toggle Button */}
        <div className="flex items-center p-5 h-16">
          <div className={`min-w-[24px] ${!open && "mx-auto"}`}>
            <FaBars 
              size={24} 
              className="text-white transition-transform duration-300 hover:scale-110"
              onClick={toggleSidebar}
            />
          </div>
          <h1 className={`text-white text-xl font-medium ml-4 transition-all duration-300 ${
            !open && "opacity-0 scale-0"
          }`}>
            Dashboard
          </h1>
        </div>

        {/* Sidebar Menu */}
        <ul className="flex-1 mt-6 px-3">
          {Menus.map((menu, index) => {
            const isActive = location.pathname === menu.href;
            return (
              <Link 
                key={index} 
                to={menu.href}
                className="block mb-2"
              >
                <li className={`flex items-center gap-x-4 p-2 rounded-md transition-all duration-300 ${
                  isActive ? "bg-gray-400" : "hover:bg-gray-300"
                }`}>
                  <div className={`min-w-[24px] ${!open && "mx-auto"}`}>
                    {menu.icon}
                  </div>
                  <span className={`text-white text-sm font-medium transition-all duration-300 ${!open && "hidden"}`}>
                    {menu.title}
                  </span>
                </li>
              </Link>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
