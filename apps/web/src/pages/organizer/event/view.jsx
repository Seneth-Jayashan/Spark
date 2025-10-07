import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { CalendarDays, MapPin, Users } from "lucide-react";
import { useEvent } from "../../../contexts/EventContext";

export default function ViewEvent() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [volunteers, setVolunteers] = useState([]);
  const [activeTab, setActiveTab] = useState("details");
  const { fetchEvent, loading } = useEvent();

  useEffect(() => {
      if (!id) return;

      const fetchData = async () => {
        try {
          const event = await fetchEvent(id);
          console.log('event:', event?.event);
          setEvent(event?.event);
        } catch (error) {
          console.error("Error fetching event:", error);
        }
      };

      fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading event...
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Event not found or you are not authorized.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 text-gray-800 px-8 py-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold tracking-wide">{event.event_name}</h1>
        <span
          className={`text-xs font-semibold px-3 py-1 rounded-full ${
            event.event_status
              ? "bg-green-100 text-green-700 border border-green-300"
              : "bg-red-100 text-red-700 border border-red-300"
          }`}
        >
          {event.event_status ? "Active" : "Inactive"}
        </span>
      </div>

      {/* Tabs */}
      <div className="relative flex items-center bg-gray-100 p-1 rounded-full shadow-inner w-fit mb-10">
        {["details", "volunteers", "analytics"].map((tab) => {
          const label =
            tab === "details"
              ? "Event Details"
              : tab === "volunteers"
              ? "Volunteers"
              : "Analytics";
          const isActive = activeTab === tab;
          return (
            <div key={tab} className="relative">
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full shadow-md"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <button
                onClick={() => setActiveTab(tab)}
                className={`relative z-10 px-6 py-2.5 text-sm font-semibold rounded-full transition-all duration-300 ${
                  isActive ? "text-white" : "text-gray-700 hover:text-gray-900"
                }`}
              >
                {label}
              </button>
            </div>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 0.98 }}
            transition={{ duration: 0.45, ease: "easeInOut" }}
            className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200"
          >
            {/* Event Details */}
            {activeTab === "details" && (
              <div>
                <h2 className="text-xl font-semibold text-blue-600 mb-4">
                  Event Information
                </h2>

                {/* Images */}
                {event.event_images?.length > 0 ? (
                  <div className="flex gap-4 overflow-x-auto mb-4">
                    {event.event_images.map((img, idx) => (
                      <img
                        key={idx}
                        src={`${import.meta.env.VITE_SERVER_URL}${img}`}
                        alt={`Event ${idx + 1}`}
                        className="w-40 h-24 object-cover rounded-lg border border-gray-200 shadow-sm"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="w-full h-40 bg-gray-200 flex items-center justify-center text-gray-500 rounded-lg mb-4">
                    No Images
                  </div>
                )}

                <div className="space-y-3 text-gray-700">
                  <p>
                    <span className="font-medium text-gray-500">Event ID: </span>
                    {event.event_id}
                  </p>
                  <p>
                    <span className="font-medium text-gray-500">Description: </span>
                    {event.event_description || "No description provided."}
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin size={16} className="text-indigo-500" />
                    <span>{event.event_venue || "Venue not specified"}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <CalendarDays size={16} className="text-indigo-500" />
                    <span>
                      {event.event_date
                        ? new Date(event.event_date).toLocaleDateString()
                        : "N/A"}{" "}
                      at {event.event_time || "N/A"}
                    </span>
                  </p>
                  <p>
                    <span className="font-medium text-gray-500">Geolocation: </span>
                    {event.event_geolocation || "N/A"}
                  </p>
                  <p>
                    <span className="font-medium text-gray-500">Organization ID: </span>
                    {event.event_org}
                  </p>
                  <p>
                    <span className="font-medium text-gray-500">
                      Volunteers Needed:{" "}
                    </span>
                    {event.need_count ?? 0}
                  </p>
                  <p>
                    <span className="font-medium text-gray-500">
                      Volunteers Joined:{" "}
                    </span>
                    {event.volunteer_count ?? 0}
                  </p>
                  <p>
                    <span className="font-medium text-gray-500">Created At: </span>
                    {new Date(event.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            )}

            {/* Volunteers Tab */}
            {activeTab === "volunteers" && (
              <div>
                <h2 className="text-xl font-semibold text-blue-600 mb-4">
                  Volunteers
                </h2>
                {volunteers.length > 0 ? (
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {volunteers.map((v) => (
                      <motion.li
                        key={v.user_id}
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                        className="bg-blue-50 p-4 rounded-lg border border-blue-100 shadow-sm hover:shadow-md"
                      >
                        <p className="font-semibold text-gray-800">{v.user_name}</p>
                        <p className="text-sm text-gray-500">{v.email}</p>
                      </motion.li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No volunteers have joined yet.</p>
                )}
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === "analytics" && (
              <div>
                <h2 className="text-xl font-semibold text-blue-600 mb-4">
                  Event Analytics
                </h2>
                <p className="text-gray-500">
                  Volunteers Needed: {event.need_count ?? 0} <br />
                  Volunteers Joined: {event.volunteer_count ?? 0}
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
