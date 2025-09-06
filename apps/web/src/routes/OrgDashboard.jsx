import { Routes, Route, Navigate } from "react-router-dom";
import { OrgProvider } from "../contexts/OrgContext";


import Dashboard from "../pages/organizer/Dashboard";
import Profile from "../pages/Profile";

import Events from "../pages/organizer/event/events"; 
import EventCreate from "../pages/organizer/event/create";
import UpdateEvent from "../pages/organizer/event/update";

import ViewOrg from "../pages/organizer/organization/view"; 
import OrgCreate from "../pages/organizer/organization/create";
import OrgUpdate from "../pages/organizer/organization/update";

export default function OrgDashboard() {
  return (
    
    <Routes>
      <Route path="/" element={<Dashboard />} />

      <Route path="event/events" element={<Events />} />
      <Route path="event/create" element={<EventCreate />} />
      <Route path="event/update/:event_id" element={<UpdateEvent />} />

      <Route path="org/view" element={<ViewOrg />} />
      <Route path="org/create" element={<OrgCreate />} />
      <Route path="org/update" element={<OrgUpdate />} />

      <Route path="/profile" element={<Profile />} />


      {/* <Route path="*" element={<Navigate to="/dashboard/organizer" replace />} /> */}
    </Routes>
  );
}
