import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTachometerAlt,
  FaBuilding,
  FaUsers,
  FaUserShield,
  FaCog,
  FaBars,
  FaSignOutAlt,
} from "react-icons/fa";

const SuperAdminSidebar = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();

  const menuItems = [
    { name: "Dashboard", path: "/dashboard/admin", icon: <FaTachometerAlt /> },
    { name: "Organizations", path: "/dashboard/admin/organizations", icon: <FaBuilding /> },
    { name: "Users", path: "/dashboard/admin/users", icon: <FaUsers /> },
    { name: "Admins", path: "/dashboard/admin/admins", icon: <FaUserShield /> },
    { name: "Settings", path: "/dashboard/admin/settings", icon: <FaCog /> },
  ];

  return (
    <motion.div
      animate={{ width: isOpen ? 240 : 64 }}
      className="fixed top-0 left-0 h-full bg-gray-900 text-gray-100 flex flex-col shadow-lg z-50"
    >
      {/* Logo & Toggle */}
<div className="flex items-center justify-between p-4 border-b border-gray-700">
  <NavLink to="/" className="flex items-center gap-2 flex-col">
    <span
      className={`${
        isOpen ? "w-32" : "w-8"
      } overflow-hidden transition-all duration-300`}
    >
      <img src="../Logo.png" alt="Logo" className="w-full h-auto" />
    </span>
    {isOpen && (
      <span className="font-semibold md:text-2xl text-lg">
        SPARK - SuperAdmin
      </span>
    )}
  </NavLink>
  <button
    onClick={() => setIsOpen(!isOpen)}
    className={`p-2 rounded transition ${
      !isOpen ? "bg-gray-900" : "hover:bg-gray-800"
    }`}
  >
    <FaBars />
  </button>
</div>


      {/* Menu */}
      <nav className="flex-1 mt-4">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-4 p-3 mx-2 rounded hover:bg-gray-800 transition ${
                isActive ? "bg-gray-700" : ""
              }`
            }
            title={!isOpen ? item.name : ""}
          >
            <span className="text-lg">{item.icon}</span>
            <AnimatePresence>
              {isOpen && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="font-medium"
                >
                  {item.name}
                </motion.span>
              )}
            </AnimatePresence>
          </NavLink>
        ))}
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
    </motion.div>
  );
};

export default SuperAdminSidebar;
