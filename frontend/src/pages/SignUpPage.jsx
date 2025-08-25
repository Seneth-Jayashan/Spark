import React, { useState, useEffect } from "react";
import SignUpOrganization from "../Components/SignUpOrganization";
import SignUpVolunteer from "../Components/SignUpVolunteer";
import { useLocation } from "react-router-dom";

const SignUpPage = () => {
  // default role can come from navigation or default to "Organization"
  const location =useLocation();
  const roleFromNav = location.state?.role || " ";

  const [role, setRole] = useState(roleFromNav);

  useEffect(() => {
    setRole(roleFromNav);
  }, [roleFromNav]);
  

  return (
    <div className="min-h-screen flex flex-col items-center mt-28">
      {/* Buttons to switch roles */}
      <div className="flex gap-4 mt-10 mb-6">
        <button
          onClick={() => setRole("Organization")}
          className={`px-6 py-3 rounded-lg font-medium ${
            role === "Organization"
              ? "bg-yellow-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Sign Up as Organization
        </button>

        <button
          onClick={() => setRole("Volunteer")}
          className={`px-6 py-3 rounded-lg font-medium ${
            role === "Volunteer"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Sign Up as Volunteer
        </button>
      </div>

      {/* Sliding Container */}
      <div className="relative w-full max-w-6xl overflow-hidden">
        <div
          className={`flex transition-transform duration-500 ease-in-out`}
          style={{
            transform:
              role === "Organization" ? "translateX(0%)" : "translateX(-100%)",
          }}
        >
          {/* Organization Form */}
          <div className="w-full flex-shrink-0">
            <SignUpOrganization />
          </div>

          {/* Volunteer Form */}
          <div className="w-full flex-shrink-0">
            <SignUpVolunteer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
