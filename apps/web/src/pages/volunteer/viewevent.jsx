import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useEvent } from "../../contexts/EventContext";
import { useAuth } from "../../contexts/AuthContext";

export default function EventDetails() {
  const { event_id } = useParams(); // get the event_id from URL
  const { fetchEvent, addMember } = useEvent(); // use your context function
  const { user } = useAuth();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetch_Event = async () => {
      try {
        const data = await fetchEvent(event_id); // call your context function
        setEvent(data.event); // set the event data
      } catch (err) {
        setError("Failed to fetch event details.");
      } finally {
        setLoading(false);
      }
    };

    fetch_Event();
  }, [event_id]);

  const handleRegister = async () => {
    if (!user) {
      alert("Please login to register for this event!");
      return;
    }
    try {
      await addMember(event.event_id, user.user_id);
      alert("Registered successfully!");
    } catch (err) {
      alert("Failed to register. Try again later.");
    }
  };

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
    <div className="min-h-screen p-6 bg-gray-50 mt-32 max-w-4xl mx-auto">
      {/* Event Images Carousel */}
      <div className="mb-6">
        {event.event_images && event.event_images.length > 0 ? (
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
          <div className="h-64 w-full bg-gray-200 flex items-center justify-center rounded-lg">
            No images available
          </div>
        )}
      </div>

      {/* Event Info */}
      <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col gap-4">
        <h1 className="text-3xl font-bold">{event.event_name}</h1>
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
        <p
          className={`font-semibold ${
            event.event_status ? "text-green-600" : "text-red-600"
          }`}
        >
          Status: {event.event_status ? "Open" : "Closed"}
        </p>

        <button
          onClick={handleRegister}
          disabled={!event.event_status}
          className={`mt-4 px-6 py-3 rounded-lg text-white font-semibold transition ${
            event.event_status
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          {event.event_status ? "Register" : "Event Closed"}
        </button>

        <button
          onClick={() => navigate(-1)}
          className="mt-2 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
        >
          Back to Events
        </button>
      </div>
    </div>
  );
}
