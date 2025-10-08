import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  FaCalendarAlt, 
  FaMapMarkerAlt, 
  FaClock, 
  FaEye,
  FaSpinner,
  FaExclamationTriangle,
  FaUserCheck,
  FaHeart
} from "react-icons/fa";

export default function Myevents() {
  const { user, loading: authLoading } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
  if (authLoading) return;
  if (!user?._id && !user?.user_id) {
    setLoading(false);
    return;
  }

  // Set Axios Authorization header locally
  if (user?.token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${user.token}`;
  }

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const userId = user.user_id || user._id;
      const res = await api.get(`/event/member/${userId}/upcoming`);

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


  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-amber-50 flex items-center justify-center">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="w-16 h-16 border-4 border-blue-900 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-blue-900 font-medium">Loading your events...</p>
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

  if (events.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-amber-50 flex items-center justify-center">
        <motion.div 
          className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md mx-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaCalendarAlt className="text-blue-900 text-xl" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">No Events Yet</h2>
          <p className="text-gray-600 mb-4">You haven't registered for any events yet.</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/dashboard/volunteer/events')}
            className="bg-blue-900 text-white px-6 py-3 rounded-2xl font-semibold hover:bg-blue-800 transition-colors"
          >
            Browse Events
          </motion.button>
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
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <FaUserCheck className="text-green-700 text-lg" />
            </div>
            <h1 className="text-2xl font-bold text-blue-900">My Registered Events</h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Here are all the events you've registered for. Click on any event to view more details.
          </p>
        </motion.div>

        {/* Events Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {events.map((event, index) => (
            <motion.div
              key={event._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                {event.event_images?.length > 0 ? (
                  <img
                    src={event.event_images[0]} // Already full URL
                    alt={event.event_name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-100 to-amber-100 flex items-center justify-center">
                    <FaCalendarAlt className="text-blue-900 text-4xl" />
                  </div>
                )}
                <div className="absolute top-4 right-4 bg-green-500/90 backdrop-blur-sm rounded-full px-3 py-1">
                  <span className="text-white text-xs font-semibold">Registered</span>
                </div>
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
                      {new Date(event.event_date).toLocaleDateString()}
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

                {/* Action Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(`/dashboard/volunteer/myevents/${event.event_id}`)}
                  className="w-full bg-gradient-to-r from-blue-900 to-blue-800 text-white px-4 py-3 rounded-2xl font-semibold hover:from-blue-800 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <FaEye />
                  More Details
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
