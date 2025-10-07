// src/pages/dashboard/organizer/event/ViewEvent.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarDays, MapPin, Users } from "lucide-react";
import { useEvent } from "../../../contexts/EventContext";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

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

export default function ViewEvent() {
  const { id } = useParams();
  const { fetchEvent, getMembers, loading } = useEvent();
  const [event, setEvent] = useState(null);
  const [volunteers, setVolunteers] = useState([]);
  const [activeTab, setActiveTab] = useState("details");
  const [location, setLocation] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        // Fetch event details
        const data = await fetchEvent(id);
        const ev = data?.event || data; 
        setEvent(ev);

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

        // Fetch volunteers
        const members = await getMembers(id);
        setVolunteers(members?.members || []);
      } catch (error) {
        console.error("Error fetching event or members:", error);
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
    <div className="min-h-screen bg-gray-100 text-gray-800 px-6 py-10">
      {/* Header */}
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

      {/* Tabs */}
      <div className="flex bg-gray-100 p-1 rounded-full shadow-inner w-fit mb-8">
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

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200"
        >
          {/* Event Details */}
          {activeTab === "details" && (
            <div>
              <h2 className="text-2xl font-semibold mb-6 text-blue-600">
                Event Information
              </h2>

              {/* Image Carousel */}
              {event.event_images?.length > 0 ? (
                <div className="flex gap-6 overflow-x-auto pb-3 mb-8 snap-x snap-mandatory">
                  {event.event_images.map((img, idx) => (
                    <div
                      key={idx}
                      className="relative w-72 h-48 flex-shrink-0 snap-start rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <img
                        src={`${import.meta.env.VITE_SERVER_URL}${img}`}
                        alt={`Event ${idx + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/20" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500 rounded-2xl mb-8">
                  No Images Available
                </div>
              )}

              {/* Info Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <InfoCard title="Event Name" icon={<Users size={18} />} value={event.event_name} />
                  <InfoCard
                    title="Description"
                    icon="📝"
                    value={event.event_description || "No description provided."}
                    longText
                  />
                  <HighlightCard
                    title="Location"
                    icon={<MapPin size={20} />}
                    color="blue"
                    value={event.event_venue || "Venue not specified"}
                  />
                  <HighlightCard
                    title="Date & Time"
                    icon={<CalendarDays size={20} />}
                    color="green"
                    value={
                      (event.event_date
                        ? new Date(event.event_date).toLocaleDateString()
                        : "N/A") + ` at ${event.event_time || "N/A"}`
                    }
                  />
                </div>

                <div className="space-y-4">
                  <InfoCard title="Organization ID" icon="🏢" value={event.event_org} />
                  <InfoCard
                    title="Volunteers"
                    icon="🙌"
                    value={`Needed: ${event.need_count ?? 0} | Joined: ${volunteers.length}`}
                  />
                  <InfoCard
                    title="Created On"
                    icon="⏰"
                    value={new Date(event.created_at).toLocaleString()}
                  />
                </div>
              </div>

              {/* Map */}
              <div className="mt-10 border border-gray-300 rounded-2xl overflow-hidden shadow-md">
                {location ? (
                  <MapContainer
                    center={[location.lat, location.lng]}
                    zoom={13}
                    scrollWheelZoom={false}
                    dragging={false}
                    doubleClickZoom={false}
                    zoomControl={false}
                    className="w-full h-72"
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
                  <p className="text-gray-500 p-6 text-center">Geolocation not available.</p>
                )}
              </div>

              {location && (
                <div className="mt-3 text-sm text-gray-600 flex items-center gap-2">
                  📍 <span>Lat: {location.lat}</span> | <span>Lng: {location.lng}</span>
                </div>
              )}
            </div>
          )}

          {/* Volunteers Tab */}
          {activeTab === "volunteers" && (
            <div>
              <h2 className="text-xl font-semibold text-blue-600 mb-4">Volunteers</h2>
              {volunteers.length > 0 ? (
                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {volunteers.map((v) => (
                    <motion.li
                      key={v.user_id}
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                      className="bg-gray-100 p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md"
                    >
                      <p className="font-bold">{v.user_name}</p>
                      <p className="text-sm text-gray-600">{v.email}</p>
                    </motion.li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No volunteers have joined yet.</p>
              )}
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === "analytics" && (
            <div>
              <h2 className="text-xl font-semibold text-blue-600 mb-4">Event Analytics</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { title: "Volunteers Needed", value: event.need_count ?? 0 },
                  { title: "Volunteers Joined", value: volunteers.length },
                  { title: "Status", value: event.event_status ? "Active" : "Inactive" },
                  { title: "Created Date", value: new Date(event.created_at).toLocaleDateString() },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-gray-100 rounded-xl p-6 text-center shadow-sm border border-gray-200"
                  >
                    <p className="text-lg font-bold">{item.value}</p>
                    <p className="text-gray-600 text-sm">{item.title}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* --- Reusable Sub Components --- */
const InfoCard = ({ title, icon, value, longText }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="bg-gray-100 p-4 rounded-xl border border-gray-200 shadow-sm"
  >
    <h3 className="flex items-center gap-2 text-lg font-semibold">
      {icon} {title}
    </h3>
    <p
      className={`mt-1 font-medium text-gray-800 ${
        longText ? "break-words whitespace-pre-wrap" : ""
      }`}
    >
      {value}
    </p>
  </motion.div>
);

const HighlightCard = ({ title, icon, color, value }) => {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-800 border-blue-300",
    green: "bg-green-100 text-green-800 border-green-300",
  };
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className={`p-5 rounded-2xl border shadow-md ${colorClasses[color]}`}
    >
      <h3 className="flex items-center gap-2 text-xl font-bold">
        {icon} {title}
      </h3>
      <p className="mt-1 text-lg font-medium">{value}</p>
    </motion.div>
  );
};
