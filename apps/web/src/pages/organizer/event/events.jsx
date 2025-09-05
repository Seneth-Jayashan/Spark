import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useOrg } from "../../../contexts/OrgContext";
import { useEvent } from "../../../contexts/EventContext";

export default function Events() {
  const { currentOrg } = useOrg();
  const { fetchEvents } = useEvent();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();


  useEffect(() => {
    const getAllEvents = async () => {
      if (!currentOrg?.organization?.org_id) return;
      try {
        const allEvents = await fetchEvents();

        // normalize response
        const eventsArray = Array.isArray(allEvents)
          ? allEvents
          : allEvents?.events || [];

        const orgEvents = eventsArray.filter(
          (e) => e.event_org === currentOrg.organization.org_id
        );
        setEvents(orgEvents);
      } catch (err) {
        console.error("Failed to fetch events:", err);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };
    getAllEvents();
  }, [currentOrg]);


  if (loading) {
    return (
      <div className="flex justify-center mt-20 text-gray-600 text-lg">
        Loading events...
      </div>
    );
  }

  return (
    <div className="px-6 py-10">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">
        {currentOrg?.organization?.org_name} Events
      </h2>

      {events.length === 0 ? (
        <p className="text-gray-500 text-lg">
          No events found for this organization.
        </p>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <motion.div
              key={event.event_id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition"
            >
              {/* Status Badge */}
              <div className="absolute top-3 right-3">
                {event.event_status ? (
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                    Active
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                    Inactive
                  </span>
                )}
              </div>

              {/* Event Image */}
              {event.event_images && event.event_images.length > 0 ? (
                <img
                  src={`${import.meta.env.VITE_SERVER_URL}${event.event_images[0]}`}
                  alt={event.event_name}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500">
                  No Image
                </div>
              )}

              {/* Event Info */}
              <div className="p-6 flex flex-col h-full">
                <h3 className="text-xl font-semibold text-gray-900">
                  {event.event_name}
                </h3>
                <p className="mt-2 text-gray-600 text-sm line-clamp-3">
                  {event.event_description || "No description provided."}
                </p>

                <div className="mt-4 flex flex-col gap-1 text-sm text-gray-500">
                  <p>📍 {event.event_venue || "No venue specified"}</p>
                  <p>
                    📅{" "}
                    {event.event_date
                      ? new Date(event.event_date).toLocaleDateString()
                      : "No date"}{" "}
                    at {event.event_time || "N/A"}
                  </p>
                  <p>👥 Volunteers Needed: {event.need_count ?? 0}</p>
                </div>

                {/* Actions */}
                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => navigate(`../event/update/${event.event_id}`)}
                    className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                  >
                    Edit
                  </button>
                  <button className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700">
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
