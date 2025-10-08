import React from "react";
import AdminUsers from "./Users";

export default function AdminAdmins({ role = "organizer" }) {
  // Show users with role=organizer as Org Admins (based on model roles)
  return <AdminUsers role={role} />;
}


