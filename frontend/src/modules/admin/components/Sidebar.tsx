import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaCar, FaAddressBook, FaBriefcase, FaCartPlus, FaChartLine, FaBars } from "react-icons/fa";

interface MenuItem {
  title: string;
  icon: React.ReactNode;
  href: string;
  basePath: string; // Base path for matching child routes
  additionalPaths?: string[]; // Optional additional paths to check
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
    { title: "Vehicle", icon: <FaCar size={24} />, href: "/admin/vehicle-page", basePath: "/admin/vehicle-page" },
    { title: "Appointment", icon: <FaAddressBook size={24} />, href: "/admin/appointment-list", basePath: "/admin/appointment" },
    { title: "Employee", icon: <FaBriefcase size={24} />, href: "/admin/employee/dashboard", basePath: "/admin/employee" },
    {
      title: "Stock",
      icon: <FaCartPlus size={24} />,
      href: "/admin/items",
      basePath: "/admin/stock",
      additionalPaths: ["/admin/items", "/admin/stock-requests", "/admin/order-stocks", "/admin/supplier-details", "/admin/stock-reports"]
    },
    { title: "Utilities", icon: <FaChartLine size={24} />, href: "/admin/utility", basePath: "/admin/utility" },
  ];

  const toggleSidebar = () => {
    setOpen(!open);
  };

  return (
    <div className="flex">
      <div
        className={`${
          open ? "w-72" : "w-20"
        } duration-300 h-full p-5 pt-8 bg-black text-white relative flex flex-col`}
      >
        {/* Sidebar Toggle Button */}
        <div className="flex items-center cursor-pointer gap-x-4 absolute" onClick={toggleSidebar}>
          <FaBars size={24} className="text-white transition-transform duration-300" />
          <h1 className={`text-white text-xl font-medium transition-all duration-300 ${!open && "opacity-0 scale-0"}`}>
            Dashboard
          </h1>
        </div>

        {/* Sidebar Menu */}
        <ul className="mt-6 flex-1 pt-8">
          {Menus.map((menu, index) => {
            // Comprehensive check for active state
            const isActive =
              // Check exact path match
              location.pathname === menu.href ||
              // Check if path starts with basePath
              (menu.basePath && location.pathname.startsWith(menu.basePath)) ||
              // Check additional paths if they exist
              (menu.additionalPaths?.some(path => location.pathname.startsWith(path)) || false);

            return (
              <li key={index} className="pt-2">
                <Link
                  to={menu.href}
                  className={`flex items-center gap-x-4 p-2 rounded-md transition-all duration-300 ${
                    isActive ? "bg-green-950 text-green-700" : "hover:bg-green-900"
                  }`}
                >
                  <div className="min-w-[24px]">{menu.icon}</div>
                  <span className={`text-white text-sm font-medium transition-all duration-300 ${!open && "hidden"}`}>
                    {menu.title}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
