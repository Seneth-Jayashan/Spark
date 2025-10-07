// src/pages/MyEventDetails.jsx
import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useEvent } from "../../contexts/EventContext";
import { MessageCircle, X } from "lucide-react";
import EventChat from "../../Components/chat";
import { useAuth } from "../../contexts/AuthContext";

export default function MyEventDetails() {
  const { event_id } = useParams();
  const { fetchEvent, getEventsByUser } = useEvent();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [expandedEvent, setExpandedEvent] = useState(null);
  const didFetch = useRef(false);


  useEffect(() => {
    if (!user?.user_id) return;
    if (didFetch.current) return;
    didFetch.current = true;

    const loadData = async () => {
      try {
        setLoading(true);
        setError("");

        const [eventRes, userEventsRes] = await Promise.all([
          fetchEvent(event_id),
          getEventsByUser(user.user_id)
        ]);

        if (eventRes?.event) {
          setEvent(eventRes.event);
        } else if (eventRes) {
          setEvent(eventRes);
        } else {
          setEvent(null);
          setError("Failed to fetch event");
        }

        setEvents(userEventsRes?.events || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch events");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user?.user_id, event_id]);

  const toggleEventDetails = (eventId) => {
    setExpandedEvent(expandedEvent === eventId ? null : eventId);
  };

  const toggleChat = (eventId) => {
    setSelectedEventId(selectedEventId === eventId ? null : eventId);
  };

  const closeChat = () => {
    setSelectedEventId(null);
  };


  if (loading && !event)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading event...
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );

  if (!event)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Event not found
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-6 mt-24 max-w-4xl mx-auto relative">

      {/* Event Images */}
      <div className="mb-6">
        {event.event_images?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {event.event_images.map((img, idx) => (
              <img
                key={idx}
                src={`${import.meta.env.VITE_SERVER_URL}${img}`}
                alt={`${event.event_name} - ${idx + 1}`}
                className="w-full h-64 object-cover rounded-lg shadow-md"
              />
            ))}
          </div>
        ) : (
          <div className="h-64 bg-gray-200 flex items-center justify-center rounded-lg">
            No images available
          </div>
        )}
      </div>

      {/* Event Info */}
      <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col gap-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">{event.event_name}</h1>

          {/* ✅ Chat Button */}
          <button
            onClick={() => toggleChat(event.event_id)}
            className={`flex items-center gap-2 mr-10 text-blue-600 hover:text-blue-800 ${
                      selectedEventId === event.event_id
                    }`}
          >
            <MessageCircle size={20} /> Message
          </button>
        </div>
        

        <p className="text-gray-700">{event.event_description}</p>

        <div className="flex flex-col sm:flex-row sm:gap-6 text-gray-600">
          <p>📅 Date: {event.event_date?.split("T")[0]}</p>
          <p>⏰ Time: {event.event_time}</p>
          <p>📍 Venue: {event.event_venue}</p>
        </div>

        <p className="text-gray-600">
          📌 Geolocation: {event.event_geolocation}
        </p>
        <p className="text-gray-600">
          🧑‍🤝‍🧑 Volunteers: {event.volunteer_count} / {event.need_count}
        </p>

        <button
          onClick={() => navigate(-1)}
          className="mt-2 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
        >
          Back to My Events
        </button>
      </div>

      {/* Pop-out Chat Modal */}
      {selectedEventId && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={closeChat}
          ></div>
          
          {/* Chat Container */}
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
            <div className="flex flex-col h-full">
              {/* Chat Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Event Chat</h3>
                  <p className="text-sm text-gray-600">
                    {events.find(e => e.event_id === selectedEventId)?.event_name}
                  </p>
                </div>
                <button
                  onClick={closeChat}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Chat Component */}
              <div className="flex-1 overflow-hidden">
                <EventChat
                  eventId={selectedEventId}
                  user_id={user?.user_id}
                  role="volunteer"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
