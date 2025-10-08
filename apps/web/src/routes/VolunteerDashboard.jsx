import { Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "../pages/volunteer/Dashboard";
import Profile from "../pages/Profile";
import Events  from "../pages/volunteer/Events";
import Myevents from "../pages/volunteer/Myevents";
import History from "../pages/volunteer/History";
import MyEventDetails from "../pages/volunteer/MyEventDetails";
import EventDetails from "../pages/volunteer/viewevent";


export default function VolanteerDashboard() {
  return (
    
    <Routes>
      <Route path="/" element={<Dashboard />} />

      <Route path="/profile" element={<Profile />} />
      <Route path="/events" element={<Events />} />
      <Route path="/myevents" element={<Myevents />} />
      <Route path="/history" element={<History />} />
      <Route path="/myevents/:event_id" element={<MyEventDetails/>} />
      <Route path="/event/:event_id" element={<EventDetails />} />


      <Route path="*" element={<Navigate to="/dashboard/volunteer" replace />} />
    </Routes>
  );
}
