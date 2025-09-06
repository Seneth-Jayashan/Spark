import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaTasks,
  FaCalendarAlt,
  FaUser,
  FaBars,
  FaSignOutAlt,
} from "react-icons/fa";

const VolunteerSidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { name: "Dashboard", path: "/dashboard/volunteer", icon: <FaTachometerAlt /> },
    { name: "My Tasks", path: "/dashboard/volunteer/tasks", icon: <FaTasks /> },
    { name: "Events", path: "/dashboard/volunteer/events", icon: <FaCalendarAlt /> },
    { name: "Profile", path: "/dashboard/volunteer/profile", icon: <FaUser /> },
  ];

  return (
    <div
      style={{ width: isOpen ? 240 : 64 }}
      className="fixed top-0 left-0 h-full bg-gray-900 text-gray-100 flex flex-col shadow-lg transition-all duration-300 z-50"
    >
      {/* Logo & Toggle */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center gap-2 flex-col">
          <span
            className={`${
              isOpen ? "w-32" : "w-8"
            } overflow-hidden transition-all duration-300`}
          >
            <img src="../../Logo.png" alt="Logo" className="w-full h-auto" />
          </span>
          {isOpen && <span className="font-semibold text-lg">SPARK - Volunteer</span>}
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`p-2 rounded transition ${!isOpen ? "bg-gray-900" : "hover:bg-gray-800"}`}
        >
          <FaBars />
        </button>
      </div>

      {/* Menu */}
      <nav className="flex-1 mt-4">
        {menuItems.map((item) => {
          const active = location.pathname === item.path;

          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={`flex items-center gap-4 p-3 mx-2 rounded hover:bg-gray-800 transition ${
                active ? "bg-gray-700" : ""
              }`}
              title={!isOpen ? item.name : ""}
            >
              <span className="text-lg">{item.icon}</span>
              {isOpen && <span className="font-medium">{item.name}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-700 mt-auto">
        <button
          className="flex items-center gap-3 w-full p-3 bg-red-600 hover:bg-red-700 rounded transition"
          onClick={() => navigate("/logout")}
        >
          <FaSignOutAlt />
          {isOpen && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default VolunteerSidebar;
