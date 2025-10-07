import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useEvent } from "../contexts/EventContext";

export default function EventDetails() {
  const { event_id } = useParams();
  const navigate = useNavigate();
  const { fetchEvent } = useEvent();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadEvent = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await fetchEvent(event_id);
        if (res?.event) {
          setEvent(res.event);
        } else if (res) {
          setEvent(res);
        } else {
          setError("Failed to fetch event");
        }
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to fetch event");
      } finally {
        setLoading(false);
      }
    };
    loadEvent();
  }, [event_id]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center mt-32">
        Loading event...
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 mt-32">
        {error}
      </div>
    );

  if (!event)
    return (
      <div className="min-h-screen flex items-center justify-center mt-32">
        Event not found
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-6 mt-32">
      <div className="max-w-5xl mx-auto">
        {/* Images */}
        <div className="mb-6">
          {event.event_images?.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {event.event_images.map((img, idx) => (
                <img
                  key={idx}
                  src={`${import.meta.env.VITE_SERVER_URL}${img}`}
                  alt={`${event.event_name} - ${idx + 1}`}
                  className="w-full h-64 object-cover rounded-xl shadow"
                />
              ))}
            </div>
          ) : (
            <div className="h-64 bg-gray-200 flex items-center justify-center rounded-xl">
              No images available
            </div>
          )}
        </div>

        {/* Details Card */}
        <div className="bg-white rounded-2xl shadow-lg ring-1 ring-gray-100 p-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <h1 className="text-3xl font-bold text-gray-900">{event.event_name}</h1>
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50"
            >
              Back
            </button>
          </div>

          <p className="text-gray-700 mb-4">{event.event_description}</p>

          <div className="flex flex-wrap items-center gap-2 mb-2 text-sm">
            <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-md">📅 {event.event_date?.split("T")[0]}</span>
            <span className="inline-flex items-center gap-1 bg-yellow-50 text-yellow-700 px-2 py-1 rounded-md">⏰ {event.event_time}</span>
            <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-2 py-1 rounded-md">📍 {event.event_venue}</span>
          </div>

          {event.event_geolocation && (
            <p className="text-sm text-gray-600">📌 Geolocation: {event.event_geolocation}</p>
          )}

          {(event.volunteer_count != null || event.need_count != null) && (
            <p className="text-sm text-gray-600 mt-2">🧑‍🤝‍🧑 Volunteers: {event.volunteer_count} / {event.need_count}</p>
          )}
        </div>
      </div>
    </div>
  );
}


