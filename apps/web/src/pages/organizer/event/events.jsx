import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useOrg } from "../../../contexts/OrgContext";
import { useEvent } from "../../../contexts/EventContext";
import { CalendarDays, MapPin, Users, Edit3, Trash2 } from "lucide-react";
import Chat from "../../../Components/chat";

export default function Events() {
  const { currentOrg } = useOrg();
  const { fetchEvents, deleteEvent } = useEvent();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);

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

      // ✅ Redirect after delete
      navigate("/dashboard/organizer/event/events");
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
      <div className="flex justify-center mt-20 text-gray-500 text-lg">
        Loading events...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-indigo-50 to-white px-6 py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
            Events
          </h1>
          <p className="text-gray-500 mt-2">
            Manage all your organization’s upcoming and past events here.
          </p>
        </div>

        <button
          onClick={() => navigate("/dashboard/organizer/event/create")}
          className="mt-4 sm:mt-0 px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 hover:shadow-lg transition"
        >
          + Create Event
        </button>
      </div>

      {/* Events List */}
      {events.length === 0 ? (
        <p className="text-gray-500 text-lg">
          No events found. Start by creating one!
        </p>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event, index) => (
            <motion.div
              key={event.event_id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              onClick={() =>
                navigate(`/dashboard/organizer/event/view/${event.event_id}`)
              }
              className="bg-white rounded-2xl shadow-md hover:shadow-2xl border border-gray-100 overflow-hidden transition-all duration-300 group cursor-pointer relative"
            >
              {/* Image Section with Status Badge */}
              <div className="relative">
                {event.event_images && event.event_images.length > 0 ? (
                  <img
                    src={`${import.meta.env.VITE_SERVER_URL}${
                      event.event_images[0]
                    }`}
                    alt={event.event_name}
                    className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-52 bg-gray-200 flex items-center justify-center text-gray-500">
                    No Image
                  </div>
                )}

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
              </div>

              {/* Card Body */}
              <div className="p-6">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {event.event_name}
                  </h2>
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      event.event_status
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {event.event_status ? "Active" : "Inactive"}
                  </span>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {event.event_description || "No description provided."}
                </p>

                {/* Event Details */}
                <div className="space-y-2 text-sm text-gray-500 mb-5">
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-indigo-500" />
                    <span>{event.event_venue || "Venue not specified"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarDays size={16} className="text-indigo-500" />
                    <span>
                      {event.event_date
                        ? new Date(event.event_date).toLocaleDateString()
                        : "No date"}{" "}
                      at {event.event_time || "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users size={16} className="text-indigo-500" />
                    <span>Volunteers Needed: {event.need_count ?? 0}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div
                  className="flex justify-between items-center border-t border-gray-100 pt-4"
                  onClick={(e) => e.stopPropagation()} // prevent parent click
                >
                  <button
                    onClick={() =>
                      navigate(
                        `/dashboard/organizer/event/update/${event.event_id}`
                      )
                    }
                    className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium text-sm transition"
                  >
                    <Edit3 size={16} /> Edit
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEventToDelete(event.event_id);
                      setDeleteModalOpen(true);
                    }}
                    className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors flex items-center gap-2"
                  >
                    <Trash2 size={16} /> Delete
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
      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Confirm Delete
            </h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this event? This action cannot be
              undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  try {
                    await deleteEvent(eventToDelete);
                    setDeleteModalOpen(false);
                    setEventToDelete(null);

                    // Redirect + refresh
                    navigate("/dashboard/organizer/event/events", {
                      replace: true,
                    });
                    window.location.reload();
                  } catch (err) {
                    console.error("Failed to delete event:", err);
                    alert("Error deleting event. Try again.");
                  }
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
