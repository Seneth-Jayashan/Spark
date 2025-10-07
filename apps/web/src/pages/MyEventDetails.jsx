// src/pages/MyEventDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useEvent } from "../contexts/EventContext";
import { MessageCircle, ArrowLeft } from "lucide-react";

export default function MyEventDetails() {
  const { event_id } = useParams();
  const { fetchEvent } = useEvent();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const getEvent = async () => {
      try {
        const data = await fetchEvent(event_id);
        setEvent(data.event);
      } catch (err) {
        setError("Failed to load event details.");
      } finally {
        setLoading(false);
      }
    };
    getEvent();
  }, [event_id]);

  if (loading)
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
    <div className="min-h-screen bg-gray-50 p-6 mt-24 max-w-4xl mx-auto">

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
        <button className="flex items-center gap-2 mr-10 text-blue-600 hover:text-blue-800">
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
        > Back to My Events
        </button>

      </div>
    </div>
  );
}
