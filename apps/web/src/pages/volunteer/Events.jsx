import React, { useEffect, useState } from "react";
import { useEvent } from "../../contexts/EventContext";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  FaCalendarAlt, 
  FaMapMarkerAlt, 
  FaClock, 
  FaUsers, 
  FaFilter,
  FaSearch,
  FaHeart,
  FaSpinner,
  FaExclamationTriangle,
  FaEye
} from "react-icons/fa";
import Swal from "sweetalert2";

export default function Events() {
  const { events, fetchPublicEvents, loading, error, addMember, getEventsByUser } = useEvent();
  const { user } = useAuth();

  const [filteredEvents, setFilteredEvents] = useState([]);
  const [locationFilter, setLocationFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [locations, setLocations] = useState([]);
  const [userRegisteredEvents, setUserRegisteredEvents] = useState([]);
  const [userEventsLoading, setUserEventsLoading] = useState(false);
  const [registeringEvents, setRegisteringEvents] = useState(new Set());
  const navigate = useNavigate();

  // Fetch public events on mount
  useEffect(() => {
    fetchPublicEvents();
  }, []);

  // Fetch user's registered events when user is available
  useEffect(() => {
    const fetchUserEvents = async () => {
      if (user?.user_id) {
        setUserEventsLoading(true);
        try {
          const userEventsData = await getEventsByUser(user.user_id);
          const registeredEventIds = (userEventsData.events || []).map(event => event.event_id);
          setUserRegisteredEvents(registeredEventIds);
        } catch (err) {
          console.error("Failed to fetch user events:", err);
        } finally {
          setUserEventsLoading(false);
        }
      }
    };

    fetchUserEvents();
  }, [user?.user_id]);

  // Populate unique locations & filter events
  useEffect(() => {
    if (!events || !Array.isArray(events)) return;

    // Extract unique event venues
    const uniqueLocations = Array.from(
      new Set(events.map((e) => e.event_venue).filter(Boolean))
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
      Swal.fire({
        icon: "warning",
        title: "Login Required",
        text: "Please login to register for this event!",
        confirmButtonColor: "#0B2545",
        background: "#ffffff",
        color: "#0B2545"
      });
      return;
    }

    // Add to registering events set
    setRegisteringEvents(prev => new Set([...prev, event_id]));

    try {
      await addMember(event_id, user.user_id);
      // Add the event to user's registered events
      setUserRegisteredEvents(prev => [...prev, event_id]);
      Swal.fire({
        icon: "success",
        title: "Registration Successful!",
        text: "You have been registered for this event.",
        confirmButtonColor: "#0B2545",
        background: "#ffffff",
        color: "#0B2545"
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: "Failed to register. Please try again later.",
        confirmButtonColor: "#0B2545",
        background: "#ffffff",
        color: "#0B2545"
      });
    } finally {
      // Remove from registering events set
      setRegisteringEvents(prev => {
        const newSet = new Set(prev);
        newSet.delete(event_id);
        return newSet;
      });
    }
  };

  // Check if user is already registered for an event
  const isUserRegistered = (event_id) => {
    return userRegisteredEvents.includes(event_id);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-amber-50 flex items-center justify-center">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="w-16 h-16 border-4 border-blue-900 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-blue-900 font-medium">Loading events...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-amber-50 flex items-center justify-center">
        <motion.div 
          className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md mx-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaExclamationTriangle className="text-red-500 text-xl" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Oops!</h2>
          <p className="text-red-500">{error}</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-amber-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-3 bg-white px-6 py-3 rounded-full shadow-lg mb-4">
            <div className="w-10 h-10 bg-[#FFB238] rounded-xl flex items-center justify-center">
              <FaCalendarAlt className="text-blue-900 text-lg" />
            </div>
            <h1 className="text-2xl font-bold text-blue-900">Available Events</h1>
            {userEventsLoading && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FaSpinner className="animate-spin" />
                <span>Loading registrations...</span>
              </div>
            )}
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover amazing volunteer opportunities and make a difference in your community.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <FaFilter className="text-blue-900" />
            </div>
            <h2 className="text-xl font-bold text-blue-900">Filter Events</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Location Dropdown */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <FaMapMarkerAlt className="text-blue-900" />
                Location
              </label>
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full p-4 rounded-2xl bg-gray-50 border-2 border-gray-200 focus:border-blue-900 focus:bg-white outline-none transition-all duration-200 text-gray-800"
              >
                <option value="">All Locations</option>
                {locations.map((loc, idx) => (
                  <option key={idx} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Picker */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <FaCalendarAlt className="text-blue-900" />
                Date
              </label>
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full p-4 rounded-2xl bg-gray-50 border-2 border-gray-200 focus:border-blue-900 focus:bg-white outline-none transition-all duration-200 text-gray-800"
              />
            </div>
          </div>
        </motion.div>

        {/* Events Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {Array.isArray(filteredEvents) && filteredEvents.length > 0 ? (
            filteredEvents.map((event, index) => (
              <motion.div
                key={event.event_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  {event.event_images && event.event_images.length > 0 ? (
                    <img
                      src={`${import.meta.env.VITE_SERVER_URL}${event.event_images[0]}`}
                      alt={event.event_name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-100 to-amber-100 flex items-center justify-center">
                      <FaCalendarAlt className="text-blue-900 text-4xl" />
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-blue-900 mb-3 group-hover:text-[#FFB238] transition-colors">
                    {event.event_name}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                    {event.event_description}
                  </p>

                  {/* Event Details */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-gray-600">
                      <FaCalendarAlt className="text-blue-900" />
                      <span className="text-sm">
                        {event.event_date?.split("T")[0]}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-3 text-gray-600">
                      <FaClock className="text-blue-900" />
                      <span className="text-sm">{event.event_time}</span>
                    </div>
                    
                    <div className="flex items-center gap-3 text-gray-600">
                      <FaMapMarkerAlt className="text-blue-900" />
                      <span className="text-sm">{event.event_venue}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => navigate(`/dashboard/volunteer/event/${event.event_id}`)}
                      className="flex-1 bg-gray-100 text-gray-700 px-4 py-3 rounded-2xl font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                    >
                      <FaEye />
                      View Details
                    </motion.button>
                    
                    {isUserRegistered(event.event_id) ? (
                      <motion.button
                        disabled
                        className="flex-1 bg-gray-300 text-gray-600 px-4 py-3 rounded-2xl font-semibold cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        <FaUsers />
                        Registered
                      </motion.button>
                    ) : registeringEvents.has(event.event_id) ? (
                      <motion.button
                        disabled
                        className="flex-1 bg-blue-700 text-white px-4 py-3 rounded-2xl font-semibold cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        <FaSpinner className="animate-spin" />
                        Registering...
                      </motion.button>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRegister(event.event_id);
                        }}
                        className="flex-1 bg-gradient-to-r from-blue-900 to-blue-800 text-white px-4 py-3 rounded-2xl font-semibold hover:from-blue-800 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                      >
                        <FaUsers />
                        Register
                      </motion.button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              className="col-span-full text-center py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaCalendarAlt className="text-gray-400 text-3xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">No Events Found</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                {locationFilter || dateFilter 
                  ? "No events match your current filters. Try adjusting your search criteria."
                  : "There are currently no events available. Check back later for new opportunities!"
                }
              </p>
              {(locationFilter || dateFilter) && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setLocationFilter("");
                    setDateFilter("");
                  }}
                  className="mt-4 bg-blue-900 text-white px-6 py-3 rounded-2xl font-semibold hover:bg-blue-800 transition-colors"
                >
                  Clear Filters
                </motion.button>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}