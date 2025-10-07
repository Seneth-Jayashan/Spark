// src/pages/Myevents.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../api/axios";
import Chat from "../../Components/chat";

export default function Myevents() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [expandedEvent, setExpandedEvent] = useState(null);

  useEffect(() => {
    if (!user?._id) return;

    const fetchEvents = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/event/member/${user.user_id}`);
        setEvents(res.data.events || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch events");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [user]);

  const toggleEventDetails = (eventId) => {
    setExpandedEvent(expandedEvent === eventId ? null : eventId);
  };

  const toggleChat = (eventId) => {
    setSelectedEventId(selectedEventId === eventId ? null : eventId);
  };

  const closeChat = () => {
    setSelectedEventId(null);
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-pulse text-center">
        <div className="w-16 h-16 bg-green-600 rounded-full mx-auto mb-4"></div>
        <p className="text-gray-600">Loading your events...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md text-center">
        <div className="text-red-500 text-4xl mb-2">⚠️</div>
        <h3 className="text-red-800 font-semibold mb-2">Oops! Something went wrong</h3>
        <p className="text-red-600">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );

  if (events.length === 0)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md p-6">
          <div className="text-6xl mb-4">📅</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No events yet</h3>
          <p className="text-gray-600 mb-4">You haven't registered for any events yet. Start exploring and join your first event!</p>
          <button 
            onClick={() => window.location.href = '/events'}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            Browse Events
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Registered Events</h1>
          <p className="text-gray-600">Manage and communicate for your upcoming events</p>
        </div>

        {/* Events Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <div
              key={event._id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300"
            >
              {/* Event Image */}
              <div className="relative">
                {event.event_images?.length > 0 ? (
                  <img
                    src={`${import.meta.env.VITE_SERVER_URL}${event.event_images[0]}`}
                    alt={event.event_name}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center">
                    <span className="text-white text-lg font-semibold">Event</span>
                  </div>
                )}
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-medium text-gray-700">
                  Registered
                </div>
              </div>

              {/* Event Content */}
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 flex-1">
                    {event.event_name}
                  </h3>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {event.event_description}
                </p>

                {/* Event Details */}
                <div className="space-y-2 text-sm text-gray-700">
                  <div className="flex items-center">
                    <span className="w-5 text-gray-400">📅</span>
                    <span>{new Date(event.event_date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-5 text-gray-400">⏰</span>
                    <span>{event.event_time}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-5 text-gray-400">📍</span>
                    <span className="flex-1">{event.event_venue}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => toggleChat(event.event_id)}
                    className={`flex-1 px-3 py-2 text-sm rounded-lg transition-colors font-medium ${
                      selectedEventId === event.event_id
                        ? 'bg-gray-600 text-white hover:bg-gray-700'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {selectedEventId === event.event_id ? 'Close Chat' : 'Open Chat'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
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
                <Chat
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