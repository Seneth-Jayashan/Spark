import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useOrg } from "../../../contexts/OrgContext";
import { useEvent } from "../../../contexts/EventContext";
import Chat from "../../../Components/chat";

export default function Events() {
  const { currentOrg } = useOrg();
  const { fetchEvents, deleteEvent } = useEvent();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [selectedEventId, setSelectedEventId] = useState(null);

  useEffect(() => {
    const getAllEvents = async () => {
      if (!currentOrg?.organization?.org_id) return;
      try {
        const allEvents = await fetchEvents();
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

  const handleDelete = async (event_id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {
      await deleteEvent(event_id);
      setEvents((prev) => prev.filter((e) => e.event_id !== event_id));
    } catch (err) {
      console.error("Failed to delete event:", err);
      alert("Error deleting event. Try again.");
    }
  };

  const toggleChat = (eventId) => {
    setSelectedEventId(selectedEventId === eventId ? null : eventId);
  };

  const closeChat = () => {
    setSelectedEventId(null);
  };

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
                  src={`${import.meta.env.VITE_SERVER_URL}${
                    event.event_images[0]
                  }`}
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
                    onClick={() =>
                      navigate(
                        `/dashboard/organizer/event/update/${event.event_id}`
                      )
                    }
                    className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(event.event_id)}
                    className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>

                  <button
                    onClick={() => toggleChat(event.event_id)}
                    className={`px-3 py-1 rounded-lg text-sm transition-colors font-medium ${
                      selectedEventId === event.event_id
                        ? "bg-gray-600 text-white hover:bg-gray-700"
                        : "bg-green-600 text-white hover:bg-green-700"
                    }`}
                  >
                    {selectedEventId === event.event_id ? "Close Chat" : "Chat"}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Pop-out Chat Modal */}
      {selectedEventId && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={closeChat}
          ></div>

          {/* Chat Container */}
          <div className="absolute right-0 top-0 h-full w-1/2 bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
            <div className="flex flex-col h-full">
              {/* Chat Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white flex-shrink-0">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Event Chat
                  </h3>
                  <p className="text-sm text-gray-600">
                    {
                      events.find((e) => e.event_id === selectedEventId)
                        ?.event_name
                    }
                  </p>
                </div>
                <button
                  onClick={closeChat}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg
                    className="w-5 h-5 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Chat Body */}
              <div className="flex-1 overflow-hidden flex flex-col">
                <Chat
                  eventId={selectedEventId}
                  user_id={currentOrg?.organization?.org_id}
                  role="organizer"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
