import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useEvent } from "../../contexts/EventContext";
import { useAuth } from "../../contexts/AuthContext";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Users, ArrowLeft } from "lucide-react";

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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-amber-50 flex items-center justify-center">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="w-16 h-16 border-4 border-blue-900 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-blue-900 font-medium">Loading event...</p>
        </motion.div>
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-amber-50 flex items-center justify-center">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-red-600" />
          </div>
          <p className="text-red-600 font-medium text-lg">{error}</p>
        </motion.div>
      </div>
    );
  if (!event)
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-amber-50 flex items-center justify-center">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-gray-600" />
          </div>
          <p className="text-gray-600 font-medium text-lg">Event not found</p>
        </motion.div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-amber-50 py-8 px-4 mt-0">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-3 bg-white px-6 py-3 rounded-full shadow-lg mb-4">
            <div className="w-10 h-10 bg-[#FFB238] rounded-xl flex items-center justify-center">
              <Calendar className="text-blue-900 text-lg" />
            </div>
            <h1 className="text-2xl font-bold text-blue-900">Event Details</h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore event details and register if it matches your interests.
          </p>
        </motion.div>

        {/* Event Images */}
        <motion.div 
          className="mb-8 flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {event.event_images && event.event_images.length > 0 ? (
            <div
              className={`grid gap-6 w-full ${
                event.event_images.length === 1
                  ? "grid-cols-1"
                  : "grid-cols-1 md:grid-cols-2"
              }`}
            >
              {event.event_images.map((img, idx) => (
                <motion.div
                  key={idx}
                  className="flex justify-center"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <img
                    src={`${import.meta.env.VITE_SERVER_URL}${img}`}
                    alt={`${event.event_name} - ${idx + 1}`}
                    className="w-full max-w-5xl h-80 md:h-96 object-cover rounded-2xl shadow-xl"
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="h-64 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center rounded-2xl shadow-lg w-full max-w-4xl">
              <div className="text-center">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500 font-medium">No images available</p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Event Info */}
        <motion.div 
          className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="p-8">
            <div className="flex-1 mb-4">
              <h1 className="text-3xl font-bold text-blue-900 mb-2">{event.event_name}</h1>
              <p className="text-gray-600 text-lg leading-relaxed">{event.event_description}</p>
            </div>

            {/* Event Details Grid */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-2xl">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Calendar className="text-blue-900" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Date</p>
                    <p className="text-blue-900 font-semibold">{event.event_date?.split("T")[0]}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-yellow-50 rounded-2xl">
                  <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
                    <Clock className="text-yellow-700" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Time</p>
                    <p className="text-yellow-700 font-semibold">{event.event_time}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-green-50 rounded-2xl">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <MapPin className="text-green-700" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Venue</p>
                    <p className="text-green-700 font-semibold">{event.event_venue}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-2xl">
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Users className="text-purple-700" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Volunteers</p>
                    <p className="text-purple-700 font-semibold">{event.volunteer_count} / {event.need_count}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Geolocation */}
            {event.event_geolocation && (
              <div className="mb-4 p-4 bg-gray-50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
                    <MapPin className="text-gray-600" size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Geolocation</p>
                    <p className="text-gray-800 font-medium">{event.event_geolocation}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Status */}
            <div className="mb-6">
              <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-semibold shadow ${
                event.event_status
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}>
                <span className="w-2.5 h-2.5 rounded-full bg-current"></span>
                {event.event_status ? "Open" : "Closed"}
              </span>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <motion.button
                onClick={handleRegister}
                disabled={!event.event_status}
                className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl ${
                  event.event_status
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }`}
                whileHover={event.event_status ? { scale: 1.03 } : {}}
                whileTap={event.event_status ? { scale: 0.98 } : {}}
              >
                {event.event_status ? "Register" : "Event Closed"}
              </motion.button>

              <motion.button
                onClick={() => navigate(-1)}
                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900 rounded-2xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg inline-flex items-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <ArrowLeft size={18} />
                Back to Events
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
