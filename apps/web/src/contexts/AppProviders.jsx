// src/contexts/AppProviders.jsx
import React from "react";
import { OrgProvider } from "./OrgContext";
import { EventProvider } from "./EventContext";
// import { AdminProvider } from "./AdminContext";
// import { VolunteerProvider } from "./VolunteerContext";

export const AppProviders = ({ children }) => {
  return (
    <OrgProvider>
        <EventProvider>
      {/* <AdminProvider>
        <VolunteerProvider> */}
          {children}
        {/* </VolunteerProvider>
      </AdminProvider> */}
        </EventProvider>
    </OrgProvider>
  );
};
