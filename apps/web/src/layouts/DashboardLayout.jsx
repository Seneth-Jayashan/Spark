import { useContext, useState } from "react";
import { Outlet } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { motion } from "framer-motion";

import SuperAdminSidebar from "../Components/sidebar/AdminSidebar";
import OrgAdminSidebar from "../Components/sidebar/OrgAdminSidebar";
import StaffSidebar from "../Components/sidebar/StaffSidebar";
import VolunteerSidebar from "../Components/sidebar/VolunteerSidebar";
import GuestSidebar from "../Components/sidebar/GuestSidebar";
import Notifications from '../pages/Notifications'; 

const DashboardLayout = () => {
  const { user, loading } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(true);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500 text-xl">Loading...</div>
      </div>
    );
  }

  const sidebarWidth = isOpen ? 240 : 64;

  const renderSidebar = () => {
    switch (user?.user_role) {
      case "admin":
        return <SuperAdminSidebar isOpen={isOpen} setIsOpen={setIsOpen} />;
      case "organizer":
        return <OrgAdminSidebar isOpen={isOpen} setIsOpen={setIsOpen} />;
      case "org_member":
        return <StaffSidebar isOpen={isOpen} setIsOpen={setIsOpen} />;
      case "volunteer":
        return <VolunteerSidebar isOpen={isOpen} setIsOpen={setIsOpen} />;
      default:
        return <GuestSidebar isOpen={isOpen} setIsOpen={setIsOpen} />;
    }
  };

  const contentVariants = {
    open: {
      x: 0,
      scale: 1,
      borderRadius: 0,
      boxShadow: "0px 0px 0px rgba(0,0,0,0)",
      transition: { type: "spring", stiffness: 200, damping: 25 }
    },
    collapsed: {
      x: 10,
      scale: 0.98,
      borderRadius: 12,
      boxShadow: "0px 10px 30px rgba(0,0,0,0.12)",
      transition: { type: "spring", stiffness: 200, damping: 25 }
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {renderSidebar()}

      <motion.div
        animate={{ width: sidebarWidth }}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
        style={{ flexShrink: 0 }}
      />

      <motion.div
        className="flex-1 flex flex-col min-h-screen" 
        variants={contentVariants}
        animate={isOpen ? "open" : "collapsed"}
      >
        {/* --- Header --- */}
        <header className="flex justify-between items-center p-4 bg-white shadow-sm sticky top-0 z-10">
          <div>
            <span className="text-lg font-semibold text-gray-700">
              Welcome, {user?.user_first_name || 'User'}
            </span>
          </div>
          <div className="flex items-center space-x-4">
            
            <Notifications /> 
            
            <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm">
              {user?.user_first_name?.[0]?.toUpperCase() || 'U'}
            </div>
          </div>
        </header>

        {/* --- Main Page Content --- */}
        <main className="p-6 flex-1 overflow-y-auto bg-gray-100">
          <Outlet />
        </main>
      </motion.div>
    </div>
  );
};

export default DashboardLayout;