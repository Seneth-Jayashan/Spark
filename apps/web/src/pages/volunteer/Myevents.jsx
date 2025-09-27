// src/pages/Myevents.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../api/axios";

export default function Myevents() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?._id) return; // wait until user is available

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

  if (loading) return <div className="p-4">Loading your events...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (events.length === 0)
    return <div className="p-4">You haven’t registered for any events yet.</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Registered Events</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <div
            key={event._id}
            className="border rounded-lg shadow bg-white overflow-hidden"
          >
            {/* Event Image */}
            {event.event_images?.length > 0 && (
              <img
                src={event.event_images[0]}
                alt={event.event_name}
                className="w-full h-40 object-cover"
              />
            )}

            {/* Event Content */}
            <div className="p-4">
              <h3 className="text-lg font-semibold">{event.event_name}</h3>
              <p className="text-gray-600 text-sm">{event.event_description}</p>

              <div className="mt-3 text-sm text-gray-700 space-y-1">
                <p>
                  📅 <strong>Date:</strong>{" "}
                  {new Date(event.event_date).toLocaleDateString()}
                </p>
                <p>
                  ⏰ <strong>Time:</strong> {event.event_time}
                </p>
                <p>
                  📍 <strong>Location:</strong> {event.event_venue}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
