import { Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "../pages/volunteer/Dashboard";
import Profile from "../pages/Profile";
import Events  from "../pages/volunteer/Events";


export default function OrgDashboard() {
  return (
    
    <Routes>
      <Route path="/" element={<Dashboard />} />

      <Route path="/profile" element={<Profile />} />
      <Route path="/events" element={<Events />} />


      <Route path="*" element={<Navigate to="/dashboard/volunteer" replace />} />
    </Routes>
  );
}
