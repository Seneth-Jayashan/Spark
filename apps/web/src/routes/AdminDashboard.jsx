import { Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "../pages/admin/Dashboard";
import Profile from "../pages/Profile";


export default function OrgDashboard() {
  return (
    
    <Routes>
      <Route path="/" element={<Dashboard />} />

      <Route path="/profile" element={<Profile />} />


      <Route path="*" element={<Navigate to="/dashboard/admin" replace />} />
    </Routes>
  );
}
