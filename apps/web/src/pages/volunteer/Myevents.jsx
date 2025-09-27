// src/pages/Myevents.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../api/axios";

export default function Myevents() {
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?._id) return; // wait until user is available

    const fetchEvent = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/event/member/${user.user_id}`);
        setEvent(res.data.event);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch events");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [user]);

  if (loading) return <div className="p-4">Loading your events...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!event) return <div className="p-4">You haven’t registered for any events yet.</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Registered Event</h2>
      <div className="border p-4 rounded shadow bg-white">
        <h3 className="text-xl font-semibold">{event.title}</h3>
        <p className="text-gray-600">{event.description}</p>
        <p className="mt-2">
          📅 <strong>Date:</strong> {new Date(event.date).toLocaleDateString()}
        </p>
        <p>
          📍 <strong>Location:</strong> {event.location}
        </p>
      </div>
    </div>
  );
}
