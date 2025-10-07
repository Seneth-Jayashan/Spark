// src/pages/dashboard/organizer/event/ViewEvent.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarDays, MapPin, Users } from "lucide-react";
import { useEvent } from "../../../contexts/EventContext";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// ✅ Fix Leaflet default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export default function ViewEvent() {
  const { id } = useParams();
  const { fetchEvent, loading } = useEvent();
  const [event, setEvent] = useState(null);
  const [volunteers, setVolunteers] = useState([]);
  const [activeTab, setActiveTab] = useState("details");
  const [location, setLocation] = useState(null);

  // ✅ Fetch event
  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        const data = await fetchEvent(id);
        const ev = data?.event;
        setEvent(ev);
        setVolunteers(data?.volunteers || []);

        // Parse geolocation
        let geo = null;
        if (ev?.event_geolocation) {
          if (typeof ev.event_geolocation === "string") {
            const [latStr, lngStr] = ev.event_geolocation.split(",");
            const lat = parseFloat(latStr);
            const lng = parseFloat(lngStr);
            if (!isNaN(lat) && !isNaN(lng)) geo = { lat, lng };
          } else if (
            typeof ev.event_geolocation === "object" &&
            ev.event_geolocation.lat &&
            ev.event_geolocation.lng
          ) {
            geo = {
              lat: parseFloat(ev.event_geolocation.lat),
              lng: parseFloat(ev.event_geolocation.lng),
            };
          }
        }
        setLocation(geo || { lat: 6.9271, lng: 79.8612 }); // Default: Colombo
      } catch (error) {
        console.error("Error fetching event:", error);
      }
    };
    fetchData();
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading event...
      </div>
    );

  if (!event)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Event not found or unauthorized.
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 text-gray-800 px-8 py-10">
      {/* 🏷️ Header */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          {event.event_name}
        </h1>
        <span
          className={`text-xs font-semibold px-3 py-1 rounded-full ${
            event.event_status
              ? "bg-green-100 text-green-700 border border-green-300"
              : "bg-red-100 text-red-700 border border-red-300"
          }`}
        >
          {event.event_status ? "Active" : "Inactive"}
        </span>
      </div>

      {/* 🔹 Tabs */}
      <div className="relative flex items-center bg-gray-100 p-1 rounded-full shadow-inner w-fit mb-10">
        {["details", "volunteers", "analytics"].map((tab) => {
          const labels = {
            details: "Event Details",
            volunteers: "Volunteers",
            analytics: "Analytics",
          };
          const isActive = activeTab === tab;
          return (
            <div key={tab} className="relative">
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full shadow-md"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <button
                onClick={() => setActiveTab(tab)}
                className={`relative z-10 px-6 py-2.5 text-sm font-semibold rounded-full transition-all duration-300 ${
                  isActive ? "text-white" : "text-gray-700 hover:text-gray-900"
                }`}
              >
                {labels[tab]}
              </button>
            </div>
          );
        })}
      </div>

      {/* 🧭 Content */}
      <div className="relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 0.98 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200"
          >
            {/* 🗂️ Event Details */}
            {activeTab === "details" && (
              <div>
                <h2 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500 mb-6">
                  Event Information
                </h2>

                {/* 🖼️ Image Carousel */}
                {event.event_images?.length > 0 ? (
                  <div className="flex gap-4 overflow-x-auto pb-3 mb-6 snap-x snap-mandatory">
                    {event.event_images.map((img, idx) => (
                      <div
                        key={idx}
                        className="relative w-56 h-36 flex-shrink-0 snap-start rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
                      >
                        <img
                          src={`${import.meta.env.VITE_SERVER_URL}${img}`}
                          alt={`Event ${idx + 1}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="w-full h-40 bg-gray-100 border border-dashed border-gray-300 flex items-center justify-center text-gray-500 rounded-2xl mb-6">
                    No Images Available
                  </div>
                )}

                {/* 💎 Cool Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  {/* Left Column */}
                  <div className="space-y-4">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100 shadow-sm"
                    >
                      <h3 className="flex items-center gap-2 text-lg font-semibold text-indigo-700">
                        <Users size={18} className="text-indigo-500" /> Event Name
                      </h3>
                      <p className="text-gray-700 mt-1">{event.event_name}</p>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-100 shadow-sm"
                    >
                      <h3 className="flex items-center gap-2 text-lg font-semibold text-purple-700">
                        📝 Description
                      </h3>
                      <p className="text-gray-700 mt-1">
                        {event.event_description || "No description provided."}
                      </p>
                    </motion.div>

                    {/* 🔥 Highlight Location */}
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      className="bg-gradient-to-r from-blue-100 to-cyan-100 p-5 rounded-2xl border border-blue-200 shadow-md"
                    >
                      <h3 className="flex items-center gap-2 text-xl font-bold text-blue-800">
                        <MapPin size={20} className="text-blue-600" /> Location
                      </h3>
                      <p className="text-lg text-blue-700 mt-1 font-medium">
                        {event.event_venue || "Venue not specified"}
                      </p>
                    </motion.div>

                    {/* 🔥 Highlight Date */}
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      className="bg-gradient-to-r from-green-100 to-emerald-100 p-5 rounded-2xl border border-green-200 shadow-md"
                    >
                      <h3 className="flex items-center gap-2 text-xl font-bold text-green-800">
                        <CalendarDays size={20} className="text-green-600" /> Date & Time
                      </h3>
                      <p className="text-lg text-green-700 mt-1 font-medium">
                        {event.event_date
                          ? new Date(event.event_date).toLocaleDateString()
                          : "N/A"}{" "}
                        at {event.event_time || "N/A"}
                      </p>
                    </motion.div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-xl border border-yellow-100 shadow-sm"
                    >
                      <h3 className="flex items-center gap-2 text-lg font-semibold text-yellow-700">
                        🏢 Organization ID
                      </h3>
                      <p className="text-gray-700 mt-1">{event.event_org}</p>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="bg-gradient-to-r from-sky-50 to-blue-50 p-4 rounded-xl border border-sky-100 shadow-sm"
                    >
                      <h3 className="flex items-center gap-2 text-lg font-semibold text-sky-700">
                        🙌 Volunteers
                      </h3>
                      <p className="text-gray-700 mt-1">
                        Needed: <span className="font-bold">{event.need_count ?? 0}</span>{" "}
                        | Joined:{" "}
                        <span className="font-bold text-green-600">
                          {event.volunteer_count ?? 0}
                        </span>
                      </p>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200 shadow-sm"
                    >
                      <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-700">
                        ⏰ Created On
                      </h3>
                      <p className="text-gray-700 mt-1">
                        {new Date(event.created_at).toLocaleString()}
                      </p>
                    </motion.div>
                  </div>
                </div>

                {/* 🗺️ Map */}
                <div className="mt-10 border border-gray-200 rounded-2xl overflow-hidden shadow-md">
                  {location ? (
                    <MapContainer
                      center={[location.lat, location.lng]}
                      zoom={13}
                      scrollWheelZoom={false}
                      dragging={false}
                      doubleClickZoom={false}
                      zoomControl={false}
                      className="w-full h-72 rounded-2xl"
                    >
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                      />
                      <Marker position={[location.lat, location.lng]}>
                        <Popup>{event.event_venue || "Event Location"}</Popup>
                      </Marker>
                    </MapContainer>
                  ) : (
                    <p className="text-gray-500 p-6 text-center">
                      Geolocation not available.
                    </p>
                  )}
                </div>

                {location && (
                  <div className="mt-3 text-sm text-gray-600 flex items-center gap-2">
                    📍 <span>Lat: {location.lat}</span> |{" "}
                    <span>Lng: {location.lng}</span>
                  </div>
                )}
              </div>
            )}

            {/* 🧑‍🤝‍🧑 Volunteers Tab */}
            {activeTab === "volunteers" && (
              <div>
                <h2 className="text-xl font-semibold text-blue-600 mb-4">
                  Volunteers
                </h2>
                {volunteers.length > 0 ? (
                  <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {volunteers.map((v) => (
                      <motion.li
                        key={v.user_id}
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                        className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100 shadow-sm hover:shadow-md"
                      >
                        <p className="font-semibold text-gray-800">
                          {v.user_name}
                        </p>
                        <p className="text-sm text-gray-500">{v.email}</p>
                      </motion.li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">
                    No volunteers have joined yet.
                  </p>
                )}
              </div>
            )}

            {/* 📊 Analytics Tab */}
            {activeTab === "analytics" && (
              <div>
                <h2 className="text-xl font-semibold text-blue-600 mb-4">
                  Event Analytics
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="bg-blue-50 rounded-xl p-6 text-center shadow-sm">
                    <p className="text-lg font-bold text-blue-600">
                      {event.need_count ?? 0}
                    </p>
                    <p className="text-gray-600 text-sm">Volunteers Needed</p>
                  </div>
                  <div className="bg-green-50 rounded-xl p-6 text-center shadow-sm">
                    <p className="text-lg font-bold text-green-600">
                      {event.volunteer_count ?? 0}
                    </p>
                    <p className="text-gray-600 text-sm">Volunteers Joined</p>
                  </div>
                  <div className="bg-indigo-50 rounded-xl p-6 text-center shadow-sm">
                    <p className="text-lg font-bold text-indigo-600">
                      {event.event_status ? "Active" : "Inactive"}
                    </p>
                    <p className="text-gray-600 text-sm">Status</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-6 text-center shadow-sm">
                    <p className="text-lg font-bold text-gray-700">
                      {new Date(event.created_at).toLocaleDateString()}
                    </p>
                    <p className="text-gray-600 text-sm">Created Date</p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
