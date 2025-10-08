import React, { useEffect, useState } from "react";
import { useEvent } from "../contexts/EventContext";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function Events() {
  const { events, fetchPublicEvents, loading, error, addMember, getEventsByUser } = useEvent();
  const { user } = useAuth();

  const [filteredEvents, setFilteredEvents] = useState([]);
  const [locationFilter, setLocationFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [locations, setLocations] = useState([]);
  const [userRegisteredEvents, setUserRegisteredEvents] = useState([]);
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

  // Fetch user's registered events to show "Registered" state
  useEffect(() => {
    const fetchUserRegistered = async () => {
      if (!user?.user_id) {
        setUserRegisteredEvents([]);
        return;
      }
      try {
        const res = await getEventsByUser(user.user_id);
        const ids = (res?.events || []).map((e) => e.event_id);
        setUserRegisteredEvents(ids);
      } catch (e) {
        setUserRegisteredEvents([]);
      }
    };
    fetchUserRegistered();
  }, [user?.user_id]);

  const isUserRegistered = (event_id) => userRegisteredEvents.includes(event_id);

  const handleRegister = async (event_id) => {
    if (!user) {
      Swal.fire({
        title: "Login Required",
        text: "Please login to register for this event!",
        icon: "warning",
        confirmButtonColor: "#2563EB", // blue-600
      });
      return;
    }
    if (user && user.user_role !== "volunteer") {
      Swal.fire({
        title: "Not Allowed",
        text: "Only volunteers can register for events.",
        icon: "info",
        confirmButtonColor: "#2563EB",
      });
      return;
    }
    try {
      await addMember(event_id, user.user_id);
      setUserRegisteredEvents((prev) => (prev.includes(event_id) ? prev : [...prev, event_id]));
      Swal.fire({
        title: "Registered!",
        text: "You have successfully registered for the event.",
        icon: "success",
        confirmButtonColor: "#2563EB", // blue-600
      });
    } catch (err) {
      Swal.fire({
        title: "Registration Failed",
        text: "Failed to register. Try again later.",
        icon: "error",
        confirmButtonColor: "#dc2626", // red-600
      });
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
      {/* Heading */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">Explore Events</h1>
        <p className="text-gray-600 mt-1">Filter and discover opportunities to make an impact.</p>
      </div>

      {/* Filters */}
      <div className="mb-8">
        <div className="bg-white rounded-2xl shadow ring-1 ring-gray-100 p-4 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
            {(locationFilter || dateFilter) && (
              <button
                type="button"
                onClick={() => {
                  setLocationFilter("");
                  setDateFilter("");
                }}
                className="text-sm text-blue-700 hover:text-blue-800 hover:underline"
              >
                Clear filters
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="locationFilter" className="block text-sm font-medium text-gray-700 mb-1">
                📍 Location
              </label>
              <select
                id="locationFilter"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full p-3 rounded-xl bg-white border border-gray-200 outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <option value="">All Locations</option>
                {locations.map((loc, idx) => (
                  <option key={idx} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="dateFilter" className="block text-sm font-medium text-gray-700 mb-1">
                📅 Date
              </label>
              <input
                id="dateFilter"
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full p-3 rounded-xl bg-white border border-gray-200 outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.isArray(filteredEvents) && filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <div
              key={event.event_id}
              onClick={() => navigate(`/events/${event.event_id}`)}
              className="group cursor-pointer bg-white rounded-2xl shadow-lg hover:shadow-xl ring-1 ring-gray-100 hover:ring-blue-200 transition overflow-hidden flex flex-col"
            >
              {/* Image */}
              {event.event_images && event.event_images.length > 0 && (
                <div className="relative h-48 w-full overflow-hidden">
                  <img
                    src={`${import.meta.env.VITE_SERVER_URL}${event.event_images[0]}`}
                    alt={event.event_name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs px-2 py-1 rounded-md shadow">Event</span>
                </div>
              )}

              <div className="p-4 flex flex-col flex-1">
                <h2 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-blue-700 transition-colors">{event.event_name}</h2>
                <p className="text-gray-700 mb-3 line-clamp-3 flex-1">
                  {event.event_description}
                </p>

                <div className="flex flex-wrap items-center gap-2 mb-4 text-sm text-gray-600">
                  <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-md">📅 {event.event_date?.split("T")[0]}</span>
                  <span className="inline-flex items-center gap-1 bg-yellow-50 text-yellow-700 px-2 py-1 rounded-md">⏰ {event.event_time}</span>
                  <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-2 py-1 rounded-md">📍 {event.event_venue}</span>
                </div>

                <div className="mt-auto flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/events/${event.event_id}`);
                    }}
                    className="flex-1 border border-blue-600 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-50 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                  >
                    View Details
                  </button>

                  {user?.user_role === "volunteer" ? (
                    isUserRegistered(event.event_id) ? (
                      <button
                        disabled
                        className="flex-1 bg-gray-200 text-gray-600 px-4 py-2 rounded-lg cursor-not-allowed"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Registered
                      </button>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRegister(event.event_id);
                        }}
                        className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                      >
                        Register
                      </button>
                    )
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!user) {
                          Swal.fire({
                            title: "Login Required",
                            text: "Please login as a volunteer to register.",
                            icon: "warning",
                            confirmButtonColor: "#2563EB",
                          });
                        } else {
                          Swal.fire({
                            title: "Volunteer Only",
                            text: "Only volunteers can register for events.",
                            icon: "info",
                            confirmButtonColor: "#2563EB",
                          });
                        }
                      }}
                      className="flex-1 bg-gray-200 text-gray-600 px-4 py-2 rounded-lg cursor-not-allowed"
                    >
                      Volunteer Only
                    </button>
                  )}
                </div>
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
