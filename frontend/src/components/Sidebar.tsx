import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

interface MenuItem {
  title: string;
  src: string;
  href: string;
}

const Sidebar: React.FC = () => {
  const [open, setOpen] = useState<boolean>(true);
  const location = useLocation(); // Get the current URL

  const Menus: MenuItem[] = [
    { title: "Vehicle", src: "/assets/car-solid.svg", href: "/admin/vehicle-page" },
    { title: "Appointment", src: "/assets/address-book-solid.svg", href: "/admin/appointment" },
    { title: "Employee", src: "/assets/briefcase-solid.svg", href: "/admin/employee/add" },
    { title: "Stock", src: "/assets/cart-flatbed-solid.svg", href: "/admin/stock" },
    { title: "Utilities", src: "/assets/chart-line-solid.svg", href: "/admin/utility" },
    { title: "LogOut", src: "/assets/right-from-bracket-solid.svg", href: "/admin/logout" },
  ];

  return (
    <div className="flex">
      <div
        className={`${
          open ? "w-72" : "w-20"
        } duration-300 h-/pull p-5 pt-8 bg-black text-white relative flex flex-col`}
      >
        {/* Sidebar Toggle Button (Bars Icon) */}
        <div className="flex items-center cursor-pointer gap-x-4" onClick={() => setOpen(!open)}>
          <img src="/assets/bars-solid.svg" className="w-6 transition-transform duration-300" alt="Menu Icon" />
          <h1 className={`text-white text-xl font-medium transition-all duration-300 ${!open && "opacity-0 scale-0"}`}>
            Dashboard
          </h1>
        </div>

        {/* Sidebar Menu */}
        <ul className="mt-6 flex-1">
          {Menus.map((menu, index) => {
            const isActive = location.pathname === menu.href; // Check if the current route matches
            return (
              <li
                key={index}
                className={`flex items-center gap-x-4 p-2 rounded-md transition-all duration-300 ${
                  isActive ? "bg-gray-400" : "hover:bg-gray-300"
                }`}
              >
                <img src={menu.src} className="w-6 h-6" alt={menu.title} />
                <Link to={menu.href} className={`text-white text-sm font-medium transition-all duration-300 ${!open && "hidden"}`}>
                  {menu.title}
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
