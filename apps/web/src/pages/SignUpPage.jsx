import React, { useState, useEffect } from "react";
import SignUpOrganization from "../Components/SignUpOrganization";
import SignUpVolunteer from "../Components/SignUpVolunteer";
import { useLocation } from "react-router-dom";

const SignUpPage = () => {
  // Default role comes from navigation or falls back to "Organization"
  const location = useLocation();
  const roleFromNav = location.state?.role || "Organization";

  const [role, setRole] = useState(roleFromNav);

  useEffect(() => {
    setRole(roleFromNav);
  }, [roleFromNav]);
  

  return (
    <div className="min-h-screen flex flex-col items-center mt-32">
      {/* Page Heading */}
      <div className="text-center px-4">
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">Create your account</h1>
        <p className="mt-2 text-gray-600 text-sm sm:text-base">Choose your role to see the right form. You can switch anytime.</p>
      </div>

      {/* Segmented Toggle */}
      <div className="mt-8 mb-6 w-full max-w-2xl px-4">
        <div className="relative bg-gray-100 rounded-xl p-1 flex shadow-inner" role="tablist" aria-label="Select signup role">
          {/* Active pill */}
          <div
            className={`absolute top-1 bottom-1 w-1/2 rounded-lg transition-transform duration-300 ease-out ${
              role === "Organization" ? "translate-x-0" : "translate-x-full"
            }`}
            style={{
              background:
                role === "Organization"
                  ? "linear-gradient(90deg, #F59E0B, #FBBF24)" // yellow gradient
                  : "linear-gradient(90deg, #2563EB, #3B82F6)", // blue gradient
            }}
            aria-hidden="true"
          />
          <button
            type="button"
            role="tab"
            aria-selected={role === "Organization"}
            aria-controls="panel-organization"
            onClick={() => setRole("Organization")}
            className={`relative z-10 flex-1 px-4 py-3 text-center font-medium rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 transition-colors ${
              role === "Organization" ? "text-white" : "text-gray-700 hover:text-gray-900"
            }`}
          >
            Organization
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={role === "Volunteer"}
            aria-controls="panel-volunteer"
            onClick={() => setRole("Volunteer")}
            className={`relative z-10 flex-1 px-4 py-3 text-center font-medium rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 transition-colors ${
              role === "Volunteer" ? "text-white" : "text-gray-700 hover:text-gray-900"
            }`}
          >
            Volunteer
          </button>
        </div>
      </div>

      {/* Sliding Container */}
      <div className="relative w-full max-w-6xl overflow-hidden px-4">
        <div
          className={`flex transition-transform duration-500 ease-in-out will-change-transform`}
          style={{
            transform: role === "Organization" ? "translateX(0%)" : "translateX(-100%)",
          }}
          aria-live="polite"
        >
          {/* Organization Form */}
          <div id="panel-organization" role="tabpanel" aria-labelledby="Organization" className="w-full flex-shrink-0">
            <SignUpOrganization />
          </div>

          {/* Volunteer Form */}
          <div id="panel-volunteer" role="tabpanel" aria-labelledby="Volunteer" className="w-full flex-shrink-0">
            <SignUpVolunteer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
