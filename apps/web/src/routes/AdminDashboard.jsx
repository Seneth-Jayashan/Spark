import { Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "../pages/admin/Dashboard";
import Profile from "../pages/Profile";
import ContactUs from "../pages/admin/contactUsreply/contactus";
import AdminContactUsReply from "../pages/admin/contactUsreply/contactUsformreply";



export default function OrgDashboard() {
  return (
    
    <Routes>
      <Route path="/" element={<Dashboard />} />

      <Route path="/profile" element={<Profile />} />
      <Route path="/contactus" element={<ContactUs />} />
      <Route path="/contactus/admin/:id" element={<AdminContactUsReply />} />
      


      <Route path="*" element={<Navigate to="/dashboard/admin" replace />} />
    </Routes>
  );
}
