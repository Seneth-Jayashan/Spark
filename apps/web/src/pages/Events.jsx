import React, { useEffect } from "react";
import { useEvent } from "../contexts/EventContext";
import { useAuth  } from "../contexts/AuthContext"; 

export default function Events() {
  const { events, fetchPublicEvents, loading, error, addMember } = useEvent();
  const { user } = useAuth (); // optional: check if user is logged in

  useEffect(() => {
    fetchPublicEvents();
  }, []);

  const handleRegister = async (event_id) => {
    if (!user) {
      alert("Please login to register for this event!");
      return;
    }
    try {
      await addMember(event_id, user.user_id);
      alert("Registered successfully!");
    } catch (err) {
      alert("Failed to register. Try again later.");
    }
  };

  if (loading) return <div>Loading events...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.isArray(events) && events.length > 0 ? (
        events.map((event) => (
          <div
            key={event.event_id}
            className="border rounded p-4 shadow hover:shadow-lg transition"
          >
            <h2 className="text-xl font-bold mb-2">{event.event_name}</h2>
            <p className="mb-2">{event.event_description}</p>
            <p className="text-sm text-gray-600 mb-4">
              {event.event_date} at {event.event_time}
            </p>
            <button
              onClick={() => handleRegister(event.event_id)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Register
            </button>
          </div>
        ))
      ) : (
        <p>No events available.</p>
      )}
    </div>
  );
}
