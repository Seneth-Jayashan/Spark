import React from "react";
import { Routes, Route } from "react-router-dom";

import ProtectedRoute from "./Components/protectedRoute";

import Header from "./Components/header";
import Footer from "./Components/footer";
import Home from "./pages/Home";
import Contact from "./pages/contactus";
import AboutUs from "./pages/AboutUs";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import VerifyEmail from "./pages/VerifyEmail";

import VolunteerDashboard from "./pages/volunteer/Dashboard";
import AdminDashboard from "./pages/admin/Dashboard";
import OrgDashboard from "./pages/organization/Dashboard";



function App() {
  return (
    <div className="App">
      <Header />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/verify/:token" element={<VerifyEmail />} />

        Protected Routes 
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
      </Routes>

      <Footer />
    </div>
  );
}

export default App;
