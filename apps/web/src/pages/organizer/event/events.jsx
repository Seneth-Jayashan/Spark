// src/pages/dashboard/organizer/event/Events.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useOrg } from "../../../contexts/OrgContext";
import { useEvent } from "../../../contexts/EventContext";
import { CalendarDays, MapPin, Users, Edit3, Trash2, X } from "lucide-react";
import Chat from "../../../Components/chat";

export default function Events() {
  const { currentOrg } = useOrg();
  const { fetchEvents, deleteEvent, getMembers } = useEvent();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const navigate = useNavigate();
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [volunteerCounts, setVolunteerCounts] = useState({});

  // Fetch all events for the organization
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

        // Fetch volunteer counts for each event
        const counts = {};
        await Promise.all(
          orgEvents.map(async (e) => {
            try {
              const members = await getMembers(e.event_id);
              counts[e.event_id] = members.members?.length || 0;
            } catch (err) {
              counts[e.event_id] = 0;
            }
          })
        );
        setVolunteerCounts(counts);
      } catch (err) {
        console.error("Failed to fetch events:", err);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };
    getAllEvents();
  }, [currentOrg]);

  const toggleChat = (eventId) => {
    setSelectedEventId(selectedEventId === eventId ? null : eventId);
  };

  const closeChat = () => {
    setSelectedEventId(null);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-gray-600">
        <div className="w-12 h-12 border-4 border-blue-900 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-sm">Loading events...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-amber-50 px-6 py-12">
      {/* Header */}
      <div className="flex flex-col gap-6 mb-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
              Events
            </h1>
            <p className="text-gray-600 mt-2">
              Manage all your organization’s upcoming and past events here.
            </p>
          </div>
          <button
            onClick={() => navigate("/dashboard/organizer/event/create")}
            className="mt-4 sm:mt-0 px-6 py-3 bg-blue-900 text-white font-semibold rounded-xl shadow-md hover:shadow-lg hover:bg-blue-800 transition-all duration-200 flex items-center gap-2"
          >
            <span className="text-lg">+</span> Create Event
          </button>
        </div>

        {/* Toolbar */}
        <div className="bg-white/80 backdrop-blur rounded-2xl border border-gray-200 p-4 flex flex-col md:flex-row gap-4 items-stretch md:items-center">
          <div className="flex-1">
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by event name..."
              className="w-full p-3 rounded-xl bg-gray-50 border-2 border-gray-200 focus:border-blue-900 focus:bg-white outline-none transition"
              type="text"
            />
          </div>
          <div className="flex gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="p-3 rounded-xl bg-gray-50 border-2 border-gray-200 focus:border-blue-900 outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Events List */}
      {events.length === 0 ? (
        <div className="text-center bg-white rounded-2xl border border-gray-200 p-10 text-gray-600">
          <p className="text-lg">No events found. Start by creating one!</p>
          <button
            onClick={() => navigate("/dashboard/organizer/event/create")}
            className="mt-4 px-6 py-3 bg-blue-900 text-white font-semibold rounded-xl shadow-md hover:shadow-lg hover:bg-blue-800 transition-all duration-200 flex items-center gap-2 mx-auto"
          >
            <span className="text-lg">+</span> Create Event
          </button>
        </div>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {events
            .filter((e) =>
              e.event_name?.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .filter((e) =>
              statusFilter === "all"
                ? true
                : statusFilter === "active"
                ? Boolean(e.event_status)
                : !Boolean(e.event_status)
            )
            .map((event, index) => (
              <motion.div
                key={event.event_id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                onClick={() =>
                  navigate(`/dashboard/organizer/event/view/${event.event_id}`)
                }
                className="bg-white rounded-2xl shadow-md hover:shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 group cursor-pointer relative"
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
                </div>

                {/* Card Body */}
                <div className="p-6">
                  <div className="flex justify-between items-center mb-3">
                    <h2 className="text-xl font-semibold text-gray-900">
                      {event.event_name}
                    </h2>
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-full border ${
                        event.event_status
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-red-50 text-red-600 border-red-200"
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
                      <span>
                        Volunteers Needed: {event.need_count ?? 0} <br />
                        Volunteers Joined:{" "}
                        {volunteerCounts[event.event_id] ?? 0}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div
                    className="border-t border-gray-100 pt-5 mt-5"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Primary Actions Row */}
                    <div className="flex flex-col sm:flex-row gap-3 mb-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() =>
                          navigate(
                            `/dashboard/organizer/event/view/${event.event_id}`
                          )
                        }
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-900 text-white rounded-xl text-sm font-semibold shadow-md hover:bg-blue-800 hover:shadow-lg transition-all duration-200"
                      >
                        <CalendarDays size={16} /> View Details
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => toggleChat(event.event_id)}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold shadow-md transition-all duration-200 ${
                          selectedEventId === event.event_id
                            ? "bg-gray-600 text-white hover:bg-gray-700"
                            : "bg-green-600 text-white hover:bg-green-700"
                        }`}
                      >
                        {selectedEventId === event.event_id ? (
                          <>
                            <X size={16} /> Close Chat
                          </>
                        ) : (
                          <>
                            <Users size={16} /> Chat
                          </>
                        )}
                      </motion.button>
                    </div>

                    {/* Secondary Actions Row */}
                    <div className="flex gap-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() =>
                          navigate(
                            `/dashboard/organizer/event/update/${event.event_id}`
                          )
                        }
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white border-2 border-blue-900 text-blue-900 rounded-xl text-sm font-medium hover:bg-blue-50 hover:border-blue-800 transition-all duration-200"
                      >
                        <Edit3 size={16} /> Edit Event
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setEventToDelete(event.event_id);
                          setDeleteModalOpen(true);
                        }}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-xl text-sm font-medium shadow-md hover:bg-red-700 hover:shadow-lg transition-all duration-200"
                      >
                        <Trash2 size={16} /> Delete
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
        </div>
      )}

      {/* Pop-out Chat Modal */}
      {selectedEventId && (
        <motion.div className="fixed inset-0 z-50 overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={closeChat}
          />
          <motion.div className="absolute right-0 top-0 h-full w-full md:w-1/2 lg:w-2/5 bg-white shadow-2xl">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-900 to-blue-800 text-white">
                <div>
                  <h3 className="text-xl font-bold">Event Chat</h3>
                  <p className="text-blue-200 text-sm">
                    {
                      events.find((e) => e.event_id === selectedEventId)
                        ?.event_name
                    }
                  </p>
                </div>
                <button
                  onClick={closeChat}
                  className="p-3 hover:bg-white/20 rounded-2xl"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="flex-1 overflow-hidden bg-gray-50">
                <Chat
                  eventId={selectedEventId}
                  user_id={currentOrg?.organization?.org_id}
                  role="organizer"
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
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
                className="px-6 py-2.5 rounded-xl border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  try {
                    await deleteEvent(eventToDelete);
                    setDeleteModalOpen(false);
                    setEventToDelete(null);
                    navigate("/dashboard/organizer/event/events", {
                      replace: true,
                    });
                    window.location.reload();
                  } catch (err) {
                    console.error("Failed to delete event:", err);
                    alert("Error deleting event. Try again.");
                  }
                }}
                className="px-6 py-2.5 bg-red-600 text-white font-medium rounded-xl shadow-md hover:bg-red-700 hover:shadow-lg transition-all duration-200"
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
