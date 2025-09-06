// Dashboard.jsx
import React from "react";
import { useOrg } from "../../contexts/OrgContext";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { currentOrg, loading } = useOrg();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600">Loading organization info...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      {currentOrg ? (
        <div>
          <h1 className="text-2xl font-bold mb-4">Org Dashboard</h1>
          <p className="text-gray-700">Welcome, {currentOrg.org_name} 🎉</p>
        </div>
      ) : (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-6 py-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold">⚠️ No Organization Found</h2>
          <p className="mt-2">
            You haven’t created an organization yet. Please create one to continue.
          </p>
          <button
            onClick={() => navigate("/dashboard/organizer/org/create")}
            className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg"
          >
            Create Organization
          </button>
        </div>
      )}
    </div>
  );
}
