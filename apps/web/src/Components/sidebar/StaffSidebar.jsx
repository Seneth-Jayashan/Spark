import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaTachometerAlt, 
  FaTasks, 
  FaCalendarAlt, 
  FaUser, 
  FaBars, 
  FaSignOutAlt 
} from "react-icons/fa";
import Logo from '../../assets/images/Logo.png';

const menuItems = [
  { name: "Dashboard", path: "/dashboard", icon: <FaTachometerAlt /> },
  { name: "My Tasks", path: "/dashboard/my-tasks", icon: <FaTasks /> },
  { name: "My Events", path: "/dashboard/my-events", icon: <FaCalendarAlt /> },
  { name: "Profile", path: "/dashboard/profile", icon: <FaUser /> },
];

const StaffSidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();

  return (
    <motion.div
      animate={{ width: isOpen ? 240 : 64 }}
      className="fixed top-0 left-0 h-full bg-white text-slate-800 flex flex-col shadow-lg z-50 border-r border-slate-200"
    >
      {/* Logo & Toggle */}
<div className="flex items-center justify-between p-4 border-b border-slate-200">
  <NavLink to="/" className="flex items-center gap-2 flex-col">
    <span
      className={`${
        isOpen ? "w-32" : "w-8"
      } overflow-hidden transition-all duration-300`}
    >
      <img src={Logo} alt="Logo" className="w-full h-auto hover:scale-[1.03] transition-transform duration-300" />
    </span>
    {isOpen && (
      <span className="font-semibold md:text-2xl text-lg text-[#FFB238]">
        SPARK - Org Member
      </span>
    )}
  </NavLink>
  <button
    onClick={() => setIsOpen(!isOpen)}
    className={`p-2 rounded-lg transition border border-transparent hover:border-[#FFB238] hover:text-[#FFB238] hover:bg-amber-50`}
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
              `group flex items-center gap-3 p-3.5 mx-2 my-1 rounded-md transition-all duration-150 border-l-2 ${
                isActive ? "bg-amber-50/60 border-[#FFB238]" : "border-transparent hover:bg-slate-100"
              }`
            }
            title={!isOpen ? item.name : ""}
          >
            <span className={`text-base inline-flex items-center justify-center w-9 h-9 rounded-md bg-blue-50 text-blue-700`}>{item.icon}</span>
            <AnimatePresence>
              {isOpen && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={`font-medium tracking-wide text-slate-800`}
                >
                  {item.name}
                </motion.span>
              )}
            </AnimatePresence>
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-slate-200">
        <button className="flex items-center gap-3 w-full p-3.5 bg-[#FFB238] text-blue-950 hover:bg-blue-900 hover:text-white rounded-md transition shadow"
        onClick={() => navigate("/logout")}>
          <FaSignOutAlt />
          {isOpen && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </motion.div>
  );
};

export default StaffSidebar;
