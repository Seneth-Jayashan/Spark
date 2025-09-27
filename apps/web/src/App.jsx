import React from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import ProtectedRoute from "./Components/protectedRoute";

import Home from "./pages/Home";
import Contact from "./pages/contactus";
import AboutUs from "./pages/AboutUs";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import VerifyEmail from "./pages/VerifyEmail";
import LogoutPage from "./pages/LogoutPage";
import Events from "./pages/Events";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./Components/ResetPassword";


import VolunteerDashboard from "./routes/VolunteerDashboard";
import AdminDashboard from "./routes/AdminDashboard";
import OrgDashboard from "./routes/OrgDashboard";

import MainLayout from "./layouts/MainLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import EventDetails from "./pages/viewevent";







function App() {
  return (
    <div className="App">

    <ToastContainer position="top-right" autoClose={3000} />

    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/verify/:token" element={<VerifyEmail />} />
        <Route path="/logout" element={<LogoutPage />} />
        <Route path="/events" element={<Events />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        <Route path="/event/:event_id" element={<EventDetails />} />

      </Route>

      { <Route element={<DashboardLayout />}>
        <Route
          path="/dashboard/admin/*"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/volunteer/*"
          element={
            <ProtectedRoute allowedRoles={["volunteer"]}>
              <VolunteerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/organizer/*"
          element={
            <ProtectedRoute allowedRoles={["organizer"]}>
              <OrgDashboard />
            </ProtectedRoute>
          }
        />
        </Route> }
      </Routes>
    </div>
  );
}

export default App;
