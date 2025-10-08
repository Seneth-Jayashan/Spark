import { Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "../pages/admin/Dashboard";
import AdminOrganizations from "../pages/admin/Organizations";
import AdminUsers from "../pages/admin/Users";
import AdminAdmins from "../pages/admin/Admins";
import Profile from "../pages/Profile";
import ContactUs from "../pages/admin/contactUsreply/contactus";
import AdminContactUsReply from "../pages/admin/contactUsreply/contactUsformreply";



export default function OrgDashboard() {
  return (
    
    <Routes>
      <Route path="/" element={<Dashboard />} />

      <Route path="/profile" element={<Profile />} />
      <Route path="/organizations" element={<AdminOrganizations />} />
      <Route path="/users" element={<AdminUsers role="volunteer" />} />
      <Route path="/admins" element={<AdminAdmins role="organizer" />} />
      <Route path="/contactus" element={<ContactUs />} />
      <Route path="/contactus/admin/:id" element={<AdminContactUsReply />} />
      


      <Route path="*" element={<Navigate to="/dashboard/admin" replace />} />
    </Routes>
  );
}
