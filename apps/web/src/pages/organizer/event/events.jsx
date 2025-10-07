import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useOrg } from "../../../contexts/OrgContext";
import { useEvent } from "../../../contexts/EventContext";
import { CalendarDays, MapPin, Users, Edit3, Trash2 } from "lucide-react";

export default function Events() {
  const { currentOrg } = useOrg();
  const { fetchEvents, deleteEvent } = useEvent();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
              className="bg-white rounded-2xl shadow-md hover:shadow-2xl border border-gray-100 overflow-hidden transition-all duration-300 group cursor-pointer"
            >
              {/* Image Section */}
              {event.event_images?.length > 0 ? (
                <div className="overflow-hidden">
                  <img
                    src={`${import.meta.env.VITE_SERVER_URL}${event.event_images[0]}`}
                    alt={event.event_name}
                    className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              ) : (
                <div className="w-full h-52 bg-gray-200 flex items-center justify-center text-gray-500">
                  No Image
                </div>
              )}

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
                    onClick={() => handleDelete(event.event_id)}
                    className="flex items-center gap-2 text-red-500 hover:text-red-600 font-medium text-sm transition"
                  >
                    <Trash2 size={16} /> Delete
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
