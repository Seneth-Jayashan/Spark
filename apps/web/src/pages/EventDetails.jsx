import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useEvent } from "../contexts/EventContext";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Users, ArrowLeft } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-amber-50 py-8 px-4 mt-28">
      <div className="max-w-5xl mx-auto">
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
            Discover event information and plan your participation.
          </p>
        </motion.div>
        {/* Images */}
        <motion.div
          className="mb-8 flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {event.event_images?.length ? (
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

        {/* Details Card */}
        <motion.div
          className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="p-8">
            <div className="flex items-start justify-between gap-4 mb-4">
              <h1 className="text-3xl font-bold text-blue-900">
                {event.event_name}
              </h1>
              <motion.button
                onClick={() => navigate(-1)}
                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900 rounded-2xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg inline-flex items-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <ArrowLeft size={18} />
                Back
              </motion.button>
            </div>

            <p className="text-gray-600 text-lg leading-relaxed mb-4">
              {event.event_description}
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-2xl">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
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
                  <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
                    <Clock className="text-yellow-700" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Time</p>
                    <p className="text-yellow-700 font-semibold">
                      {event.event_time}
                    </p>
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
                    <p className="text-green-700 font-semibold">
                      {event.event_venue}
                    </p>
                  </div>
                </div>

                {(event.volunteer_count != null ||
                  event.need_count != null) && (
                  <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-2xl">
                    <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                      <Users className="text-purple-700" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Volunteers
                      </p>
                      <p className="text-purple-700 font-semibold">
                        {event.volunteer_count} / {event.need_count}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {event.event_geolocation &&
              (() => {
                // Determine location
                let loc = { lat: 6.9271, lng: 79.8612 }; // default Colombo
                if (typeof event.event_geolocation === "string") {
                  const [latStr, lngStr] = event.event_geolocation.split(",");
                  const lat = parseFloat(latStr);
                  const lng = parseFloat(lngStr);
                  if (!isNaN(lat) && !isNaN(lng)) loc = { lat, lng };
                } else if (
                  typeof event.event_geolocation === "object" &&
                  event.event_geolocation.lat &&
                  event.event_geolocation.lng
                ) {
                  loc = {
                    lat: parseFloat(event.event_geolocation.lat),
                    lng: parseFloat(event.event_geolocation.lng),
                  };
                }

                return (
                  <div className="mb-6 bg-gray-50 rounded-2xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
                        <MapPin className="text-gray-600" size={16} />
                      </div>
                      <p className="text-sm font-medium text-gray-600">
                        Geolocation
                      </p>
                    </div>

                    <div className="h-64 w-full rounded-xl overflow-hidden border border-gray-200">
                      <MapContainer
                        center={[loc.lat, loc.lng]}
                        zoom={13}
                        scrollWheelZoom={false}
                        dragging={false}
                        doubleClickZoom={false}
                        zoomControl={false}
                        className="w-full h-full rounded-xl"
                      >
                        <TileLayer
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        />
                        <Marker position={[loc.lat, loc.lng]}>
                          <Popup>{event.event_venue || "Event Location"}</Popup>
                        </Marker>
                      </MapContainer>
                    </div>

                    <div className="mt-3 text-sm text-gray-600 flex items-center gap-2">
                      📍 <span>Lat: {loc.lat}</span> |{" "}
                      <span>Lng: {loc.lng}</span>
                    </div>
                  </div>
                );
              })()}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
