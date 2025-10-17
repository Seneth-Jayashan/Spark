// src/pages/MyEventDetails.jsx
import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useEvent } from "../../contexts/EventContext";
import {
  MessageCircle,
  X,
  Calendar,
  Clock,
  MapPin,
  Users,
  ArrowLeft,
} from "lucide-react";
import EventChat from "../../Components/chat";
import { useAuth } from "../../contexts/AuthContext";
import { motion } from "framer-motion";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// --- NEW ---
// Import Slider components
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// --- END NEW ---

// Fix Leaflet default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export default function MyEventDetails() {
  const { event_id } = useParams();
  const { fetchEvent, getEventsByUser, getMembers } = useEvent();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [volunteerCount, setVolunteerCount] = useState(0);
  const didFetch = useRef(false);

  // --- NEW: Slider Settings ---
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    arrows: true,
    className: "w-full",
  };
  // --- END NEW ---

  useEffect(() => {
    if (!user?.user_id) return;
    if (didFetch.current) return;
    didFetch.current = true;

    const loadData = async () => {
      try {
        setLoading(true);
        setError("");

        const [eventRes, userEventsRes] = await Promise.all([
          fetchEvent(event_id),
          getEventsByUser(user.user_id),
        ]);

        let currentEvent = null;
        if (eventRes?.event) {
          currentEvent = eventRes.event;
        } else if (eventRes) {
          currentEvent = eventRes;
        }

        if (currentEvent) {
          setEvent(currentEvent);
          // Fetch volunteer count for this event
          try {
            const membersRes = await getMembers(currentEvent.event_id);
            setVolunteerCount(membersRes?.members?.length || 0);
          } catch (err) {
            console.error("Failed to fetch volunteer count:", err);
            setVolunteerCount(0);
          }
        } else {
          setEvent(null);
          setError("Failed to fetch event");
        }

        setEvents(userEventsRes?.events || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch events");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user?.user_id, event_id, fetchEvent, getEventsByUser, getMembers]); // Added dependencies

  const toggleChat = (eventId) => {
    setSelectedEventId(selectedEventId === eventId ? null : eventId);
  };

  const closeChat = () => {
    setSelectedEventId(null);
  };

  if (loading && !event)
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
            <X className="w-8 h-8 text-red-600" />
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

  // --- Geolocation parsing logic moved up for cleanliness ---
  let mapLocation = null;
  if (event.event_geolocation) {
    mapLocation = { lat: 6.9271, lng: 79.8612 }; // default Colombo
    if (typeof event.event_geolocation === "string") {
      const [latStr, lngStr] = event.event_geolocation.split(",");
      const lat = parseFloat(latStr);
      const lng = parseFloat(lngStr);
      if (!isNaN(lat) && !isNaN(lng)) mapLocation = { lat, lng };
    } else if (
      typeof event.event_geolocation === "object" &&
      event.event_geolocation.lat &&
      event.event_geolocation.lng
    ) {
      mapLocation = {
        lat: parseFloat(event.event_geolocation.lat),
        lng: parseFloat(event.event_geolocation.lng),
      };
    }
  }
  // --- End Geolocation ---

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-amber-50 py-8 px-4">
      <div className="max-w-6xl mx-auto relative">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Back Button (moved here for better UX) */}
          <button
            onClick={() => navigate(-1)}
            className="absolute top-0 left-0 flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-100 text-gray-700 rounded-full font-medium transition-all duration-200 shadow-md"
          >
            <ArrowLeft size={18} />
            Back
          </button>

          <div className="inline-flex items-center gap-3 bg-white px-6 py-3 rounded-full shadow-lg mb-4">
            <div className="w-10 h-10 bg-[#FFB238] rounded-xl flex items-center justify-center">
              <Calendar className="text-blue-900 text-lg" />
            </div>
            <h1 className="text-2xl font-bold text-blue-900">Event Details</h1>
          </div>
        </motion.div>

        {/* --- NEW: Single Product Page Layout --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Column 1: Image Slider */}
          <motion.div
            className="w-full"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {event.event_images?.length > 0 ? (
              <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-4">
                <Slider {...sliderSettings}>
                  {event.event_images.map((img, idx) => (
                    <div key={idx}>
                      <img
                        src={`${import.meta.env.VITE_SERVER_URL}${img}`}
                        alt={`${event.event_name} - ${idx + 1}`}
                        className="w-full h-96 object-cover rounded-2xl"
                      />
                    </div>
                  ))}
                </Slider>
              </div>
            ) : (
              <div className="h-96 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center rounded-2xl shadow-lg w-full">
                <div className="text-center">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 font-medium">No images available</p>
                </div>
              </div>
            )}
          </motion.div>

          {/* Column 2: Event Info */}
          <motion.div
            className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="p-8">
              {/* Header with Title and Chat Button */}
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-blue-900 mb-2">
                    {event.event_name}
                  </h1>
                </div>

                {/* Chat Button */}
                <motion.button
                  onClick={() => toggleChat(event.event_id)}
                  className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl ${
                    selectedEventId === event.event_id
                      ? "bg-blue-900 text-white"
                      : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <MessageCircle size={20} />
                  Message
                </motion.button>
              </div>

              {/* Description */}
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                {event.event_description}
              </p>

              {/* Event Details Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-2xl">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Calendar className="text-blue-900" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Date</p>
                    <p className="text-blue-900 font-semibold">
                      {event.event_date?.split("T")[0]}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-yellow-50 rounded-2xl">
                  <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock className="text-yellow-700" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Time</p>
                    <p className="text-yellow-700 font-semibold">
                      {event.event_time}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-green-50 rounded-2xl">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="text-green-700" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Venue</p>
                    <p className="text-green-700 font-semibold">
                      {event.event_venue}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-2xl">
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Users className="text-purple-700" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Volunteers
                    </p>
                    <p className="text-purple-700 font-semibold">
                      {volunteerCount} / {event.need_count}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        {/* --- END NEW Layout --- */}

        {/* --- Geolocation Map (Full Width Below) --- */}
        {mapLocation && (
          <motion.div
            className="mt-8 bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                  <MapPin className="text-gray-600" />
                </div>
                <h2 className="text-xl font-bold text-blue-900">
                  Event Location
                </h2>
              </div>

              <div className="relative h-80 w-full rounded-2xl overflow-hidden border border-gray-200">
                <MapContainer
                  center={[mapLocation.lat, mapLocation.lng]}
                  zoom={13}
                  scrollWheelZoom={true} // Allow scroll zoom on this bigger map
                  dragging={true}
                  doubleClickZoom={true}
                  zoomControl={true}
                  className="w-full h-full rounded-xl z-0"
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  />
                  <Marker position={[mapLocation.lat, mapLocation.lng]}>
                    <Popup>{event.event_venue || "Event Location"}</Popup>
                  </Marker>
                </MapContainer>
              </div>

              <div className="mt-3 text-sm text-gray-600 flex items-center gap-2">
                📍 <span>Lat: {mapLocation.lat}</span> |{" "}
                <span>Lng: {mapLocation.lng}</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Pop-out Chat Modal (No changes needed) */}
        {selectedEventId && (
          <motion.div
            className="fixed inset-0 z-50 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
              onClick={closeChat}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Chat Container */}
            <motion.div
              className="absolute right-0 top-0 h-full w-full md:w-1/2 lg:w-2/5 bg-white shadow-2xl"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              <div className="flex flex-col h-full">
                {/* Chat Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-900 to-blue-800 text-white">
                  <div>
                    <h3 className="text-xl font-bold">Event Chat</h3>
                    <p className="text-blue-200 text-sm">
                      {
                        events.find((e) => e.event_id === selectedEventId)
                          ?.event_name
                      }
                    </p>
                  </div>
                  <motion.button
                    onClick={closeChat}
                    className="p-3 hover:bg-white/20 rounded-2xl transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X className="w-6 h-6" />
                  </motion.button>
                </div>

                {/* Chat Component */}
                <div className="flex-1 overflow-hidden bg-gray-50">
                  <EventChat
                    eventId={selectedEventId}
                    user_id={user?.user_id}
                    role="volunteer"
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}