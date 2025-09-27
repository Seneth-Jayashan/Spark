import React, { useEffect, useState } from "react";
import { useEvent } from "../../contexts/EventContext";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Events() {
  const { events, fetchPublicEvents, loading, error, addMember } = useEvent();
  const { user } = useAuth();

  const [filteredEvents, setFilteredEvents] = useState([]);
  const [locationFilter, setLocationFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [locations, setLocations] = useState([]);
  const navigate = useNavigate();

  // Fetch events on mount
  useEffect(() => {
    fetchPublicEvents();
  }, []);

  // Populate unique locations & filter events
  useEffect(() => {
    if (!events) return;

    // Extract unique event venues
    const uniqueLocations = Array.from(
      new Set(events.map((e) => e.event_venue))
    );
    setLocations(uniqueLocations);

    let filtered = events;

    if (locationFilter) {
      filtered = filtered.filter((e) => e.event_venue === locationFilter);
    }

    if (dateFilter) {
      filtered = filtered.filter(
        (e) => e.event_date?.split("T")[0] === dateFilter
      );
    }

    setFilteredEvents(filtered);
  }, [events, locationFilter, dateFilter]);

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

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading events...
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        {error}
      </div>
    );

  return (
    <div className="min-h-screen p-6 bg-gray-50 mt-32">
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        {/* Location Dropdown */}
        <select
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          className="p-3 rounded-lg border border-gray-300 outline-none focus:border-blue-500"
        >
          <option value="">All Locations</option>
          {locations.map((loc, idx) => (
            <option key={idx} value={loc}>
              {loc}
            </option>
          ))}
        </select>

        {/* Date Picker */}
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="p-3 rounded-lg border border-gray-300 outline-none focus:border-blue-500"
        />
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.isArray(filteredEvents) && filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <div
              key={event.event_id}
              onClick={() => navigate(`/event/${event.event_id}`)}
              className="cursor-pointer bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden flex flex-col"
            >
              {/* Image */}
              {event.event_images && event.event_images.length > 0 && (
                <img
                  src={`${import.meta.env.VITE_SERVER_URL}${
                    event.event_images[0]
                  }`}
                  alt={event.event_name}
                  className="h-48 w-full object-cover"
                />
              )}

              <div className="p-4 flex flex-col flex-1">
                <h2 className="text-xl font-bold mb-2">{event.event_name}</h2>
                <p className="text-gray-700 mb-2 flex-1">
                  {event.event_description}
                </p>

                <p className="text-sm text-gray-500 mb-1">
                  📅 {event.event_date?.split("T")[0]} at {event.event_time}
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  📍 {event.event_venue}
                </p>

                <button
                  onClick={(e) => {
                    e.stopPropagation(); // prevent navigating to event details
                    handleRegister(event.event_id);
                  }}
                  className="mt-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Register
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500 mt-8">
            No events available.
          </p>
        )}
      </div>
    </div>
  );
}
