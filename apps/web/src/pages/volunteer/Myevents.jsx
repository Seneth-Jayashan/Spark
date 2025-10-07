// src/pages/Myevents.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";

export default function Myevents() {
  const { user, loading: authLoading } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Wait until AuthContext finishes loading
    if (authLoading) return;

    if (!user?._id && !user?.user_id) {
      setLoading(false);
      return;
    }

    // Wait until axios default Authorization header is set
    if (!api.defaults.headers.common["Authorization"]) return;

    const fetchEvents = async () => {
      try {
        setLoading(true);
        const userId = user.user_id || user._id;
        const res = await api.get(`/event/member/${userId}`);

        // Make full URLs for event images
        const eventsWithFullImage = (res.data.events || []).map((event) => ({
          ...event,
          event_images: event.event_images?.map(
            (img) => `${import.meta.env.VITE_SERVER_URL}${img}`
          ),
        }));

        setEvents(eventsWithFullImage);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch events");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [user, authLoading]);

  if (authLoading || loading)
    return <div className="p-4">Loading your events...</div>;

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
            onClick={() =>
              navigate(`/dashboard/volunteer/myevents/${event.event_id}`)
            }
            className="border rounded-lg shadow bg-white overflow-hidden cursor-pointer hover:shadow-lg transition"
          >
            {event.event_images?.length > 0 ? (
              <img
                src={event.event_images[0]} // Already full URL
                alt={event.event_name}
                className="w-full h-40 object-cover"
              />
            ) : (
              <div className="h-40 bg-gray-200 flex items-center justify-center">
                No image
              </div>
            )}

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
