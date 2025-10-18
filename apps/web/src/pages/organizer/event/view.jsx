import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarDays, MapPin, Users } from "lucide-react";
import { useEvent } from "../../../contexts/EventContext";
import { useAuth } from "../../../contexts/AuthContext";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from "recharts";

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

function InfoCard({ title, icon, value, longText }) {
  return (
    <motion.div whileHover={{ scale: 1.02 }} className="bg-gray-100 p-4 rounded-xl border border-gray-200 shadow-sm">
      <h3 className="flex items-center gap-2 text-lg font-semibold">
        {icon} {title}
      </h3>
      <p className={`mt-1 font-medium text-gray-800 ${longText ? "break-words whitespace-pre-wrap" : ""}`}>
        {value}
      </p>
    </motion.div>
  );
}

function HighlightCard({ title, icon, color, value }) {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-800 border-blue-300",
    green: "bg-green-100 text-green-800 border-green-300",
  };
  return (
    <motion.div whileHover={{ scale: 1.03 }} className={`p-5 rounded-2xl border shadow-md ${colorClasses[color]}`}>
      <h3 className="flex items-center gap-2 text-xl font-bold">
        {icon} {title}
      </h3>
      <p className="mt-1 text-lg font-medium">{value}</p>
    </motion.div>
  );
}

export default function ViewEvent() {
  const { id } = useParams();
  const { getUser } = useAuth();
  const { fetchEvent, getMembers, loading,updateParticipation,getParticipationForEvent } = useEvent();

  const [event, setEvent] = useState(null);
  const [volunteers, setVolunteers] = useState([]);
  const [volunteerDetails, setVolunteerDetails] = useState([]);
  const [activeTab, setActiveTab] = useState("details");
  const [location, setLocation] = useState(null);
  const [loadingVolunteers, setLoadingVolunteers] = useState(false);
  const [participationStatus, setParticipationStatus] = useState({});
  const [selectedVolunteers, setSelectedVolunteers] = useState([]);

  // Fetch event + volunteers
  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const data = await fetchEvent(id);
        const ev = data?.event || data;
        setEvent(ev);

        // ... (geolocation parsing is fine) ...
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
        setLocation(geo || { lat: 6.9271, lng: 79.8612 });

        // Fetch volunteers
        const members = await getMembers(id);
        setVolunteers(members?.members || []);
      } catch (error) {
        console.error("Error fetching event or members:", error);
      }
    };

    fetchData();
  }, [id, fetchEvent, getMembers]);

  useEffect(() => {
    async function loadVolunteerDetails() {
      if (!volunteers || volunteers.length === 0 || !event) return;
      setLoadingVolunteers(true);
      try {
        // 1️⃣ Load all user details
        const details = await Promise.all(
          volunteers.map((v) => getUser(v.user_id))
        );

        // 2️⃣ Load participation records
        const participations = await getParticipationForEvent(event.event_id);
        const merged = details.map((user, index) => {

          const match = participations.find((p) => {
            const participationUserId = p.user_id ? p.user_id.user_id : undefined;  
            // Use '==' for type-insensitive comparison (e.g., 1 == "1")
            return participationUserId == user.user_id;
          });


          const finalUser = {
            ...user,
            status: match ? match.status : "Not Participated",
          };
          return finalUser;
        });

        setVolunteerDetails(merged);

        // 5️⃣ Initialize participation status object
        const initialStatus = {};
        merged.forEach((v) => {
          initialStatus[v.user_id] = v.status;
        });
        setParticipationStatus(initialStatus);

      } catch (err) {
        console.error("Failed to load volunteer details:", err);
      } finally {
        setLoadingVolunteers(false);
      }
    }

    loadVolunteerDetails();
  }, [
    volunteers, 
    event, 
    getUser, 
    getParticipationForEvent,
    // Added missing state setters (good practice for linters)
    setLoadingVolunteers,
    setVolunteerDetails,
    setParticipationStatus
  ]);
  
  const bulkUpdateParticipation = async (newStatus) => {
    setParticipationStatus((prev) => {
      const updated = { ...prev };
      selectedVolunteers.forEach((id) => {
        updated[id] = newStatus;
      });
      return updated;
    });

    try {
      await Promise.all(
        selectedVolunteers.map(id => 
          updateParticipation(event.event_id, id, newStatus)
        )
      );
      setSelectedVolunteers([]);
    } catch (err) {
      console.error('Bulk update failed:', err);
    }
  };

  //parse volunteers participation status

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
          {activeTab === "details" && (
            <EventDetails event={event} volunteers={volunteers} location={location} />
          )}

          {activeTab === "volunteers" && (
            <VolunteersTab
              volunteerDetails={volunteerDetails}
              loadingVolunteers={loadingVolunteers}
              participationStatus={participationStatus}
              selectedVolunteers={selectedVolunteers}
              setSelectedVolunteers={setSelectedVolunteers}
              bulkUpdateParticipation={bulkUpdateParticipation}
            />
          )}

          {activeTab === "analytics" && (
            <EventAnalytics
              event={event}
              volunteers={volunteers}
              participationStatus={participationStatus}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* --- Sub Components --- */

const EventDetails = ({ event, volunteers, location }) => (
  <div>
    <h2 className="text-2xl font-semibold mb-6 text-blue-600">Event Information</h2>

    {/* Images */}
    {event.event_images?.length > 0 ? (
      <div className="flex justify-center gap-6 overflow-x-auto pb-3 mb-8 snap-x snap-mandatory">
        {event.event_images.map((img, idx) => (
          <div
            key={idx}
            className="relative w-80 h-56 flex-shrink-0 snap-start rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
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

    {/* Info */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <InfoCard title="Event Name" icon={<Users size={18} />} value={event.event_name} />
        <InfoCard title="Description" icon="📝" value={event.event_description || "No description provided."} longText />
        <HighlightCard title="Location" icon={<MapPin size={20} />} color="blue" value={event.event_venue || "Venue not specified"} />
        <HighlightCard title="Date & Time" icon={<CalendarDays size={20} />} color="green" value={`${new Date(event.event_date).toLocaleDateString()} at ${event.event_time || "N/A"}`} />
      </div>

      <div className="space-y-4">
        <InfoCard title="Organization ID" icon="🏢" value={event.event_org} />
        <InfoCard title="Volunteers" icon="🙌" value={`Needed: ${event.need_count ?? 0} | Joined: ${volunteers.length}`} />
        <InfoCard title="Created On" icon="⏰" value={new Date(event.created_at).toLocaleString()} />
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
);

const VolunteersTab = ({
  volunteerDetails,
  loadingVolunteers,
  participationStatus,
  selectedVolunteers,
  setSelectedVolunteers,
  bulkUpdateParticipation,
}) => {
  const exportCSV = () => {
    const headers = ["#", "Name", "Email", "Phone", "Participation"];
    const rows = volunteerDetails.map((v, index) => {
      const status = participationStatus[v.user_id] || "Not Participated";
      const name = `${v.user_first_name || ""} ${v.user_last_name || ""}`.trim();
      const email = v.user_email || "";
      const phone = v.user_phone_number || "N/A";
      return [index + 1, name, email, phone, status];
    });
    const escape = (val) => {
      const s = String(val ?? "");
      if (/[",\n]/.test(s)) return '"' + s.replaceAll('"', '""') + '"';
      return s;
    };
    const csv = [headers.join(","), ...rows.map((r) => r.map(escape).join(","))].join("\n");
    const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "volunteers.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportPDF = () => {
    const rowsHtml = volunteerDetails
      .map((v, index) => {
        const status = participationStatus[v.user_id] || "Not Participated";
        const name = `${v.user_first_name || ""} ${v.user_last_name || ""}`.trim();
        const email = v.user_email || "";
        const phone = v.user_phone_number || "N/A";
        return `<tr>
                  <td style="padding:8px;border:1px solid #e5e7eb;">${index + 1}</td>
                  <td style="padding:8px;border:1px solid #e5e7eb;">${name}</td>
                  <td style="padding:8px;border:1px solid #e5e7eb;">${email}</td>
                  <td style="padding:8px;border:1px solid #e5e7eb;">${phone}</td>
                  <td style="padding:8px;border:1px solid #e5e7eb;">${status}</td>
                </tr>`;
      })
      .join("");

    const now = new Date();
    const generatedOn = now.toLocaleString();

    const html = `<!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Volunteers</title>
          <style>
            @page { size: A4 landscape; margin: 16mm; }
            * { box-sizing: border-box; }
            body { font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; color: #111827; }
            .header { display:flex; justify-content: space-between; align-items: baseline; margin-bottom: 12px; }
            .title { font-size: 18px; font-weight: 700; }
            .meta { font-size: 11px; color: #6b7280; }
            table { width: 100%; border-collapse: collapse; table-layout: fixed; }
            thead th { background: #1f2937; color: #ffffff; }
            th, td { padding: 8px; border: 1px solid #e5e7eb; text-align: left; font-size: 11px; word-break: break-word; }
            tbody tr:nth-child(odd) { background: #f9fafb; }
            tbody tr:nth-child(even) { background: #ffffff; }
            tbody td:nth-child(1) { width: 48px; text-align: center; }
            tbody td:nth-child(3) { word-break: break-all; }
            .footer { margin-top: 10px; font-size: 10px; color: #6b7280; text-align: right; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">Volunteer List</div>
            <div class="meta">Generated on: ${generatedOn}</div>
          </div>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Participation</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>
          <div class="footer">Exported from Spark</div>
          <script>window.onload = () => { window.print(); }<\/script>
        </body>
      </html>`;

    const win = window.open("", "_blank");
    if (!win) return;
    win.document.open();
    win.document.write(html);
    win.document.close();
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-blue-600 mb-6">Volunteer List</h2>

      {loadingVolunteers ? (
        <p className="text-gray-500">Loading volunteer details...</p>
      ) : volunteerDetails.length > 0 ? (
        <>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={
                  volunteerDetails.length > 0 &&
                  volunteerDetails.every((v) =>
                    selectedVolunteers.includes(v.user_id)
                  )
                }
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedVolunteers(volunteerDetails.map((v) => v.user_id));
                  } else {
                    setSelectedVolunteers([]);
                  }
                }}
                className="w-4 h-4 accent-blue-600"
              />
              <span className="text-sm text-gray-700 font-medium">Select All</span>
            </div>

            <div className="flex gap-3">
              <motion.button
                whileTap={{ scale: 0.95 }}
                disabled={selectedVolunteers.length === 0}
                onClick={() => bulkUpdateParticipation("Participated")}
                className={`px-4 py-2 text-sm font-semibold rounded-full border transition-all duration-300 shadow-sm ${
                  selectedVolunteers.length === 0
                    ? "opacity-50 cursor-not-allowed bg-gray-100 text-gray-400"
                    : "border-green-500 text-green-600 hover:bg-green-500 hover:text-white"
                }`}
              >
                Mark Selected
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.95 }}
                disabled={selectedVolunteers.length === 0}
                onClick={() => bulkUpdateParticipation("Not Participated")}
                className={`px-4 py-2 text-sm font-semibold rounded-full border transition-all duration-300 shadow-sm ${
                  selectedVolunteers.length === 0
                    ? "opacity-50 cursor-not-allowed bg-gray-100 text-gray-400"
                    : "border-red-500 text-red-600 hover:bg-red-500 hover:text-white"
                }`}
              >
                Unmark Selected
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={exportCSV}
                className="px-4 py-2 text-sm font-semibold rounded-full border border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white transition-all duration-300 shadow-sm"
              >
                Export CSV
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={exportPDF}
                className="px-4 py-2 text-sm font-semibold rounded-full border border-indigo-500 text-indigo-600 hover:bg-indigo-500 hover:text-white transition-all duration-300 shadow-sm"
              >
                Export PDF
              </motion.button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-xl shadow-sm">
              <thead className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                <tr>
                  <th className="py-3 px-4 text-left text-sm font-semibold"></th>
                  <th className="py-3 px-4 text-left text-sm font-semibold">#</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold">Name</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold">Email</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold">Phone</th>
                  <th className="py-3 px-4 text-center text-sm font-semibold">Participation</th>
                </tr>
              </thead>
              <tbody>
                {volunteerDetails.map((v, index) => {
                  const status = participationStatus[v.user_id];
                  const participated = status === "Participated";
                  const isSelected = selectedVolunteers.includes(v.user_id);

                  return (
                    <motion.tr
                      key={v.user_id}
                      whileHover={{ scale: 1.01, backgroundColor: "#f9fafb" }}
                      transition={{ duration: 0.2 }}
                      className="border-b border-gray-200 text-sm"
                    >
                      <td className="py-3 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedVolunteers((prev) => [...prev, v.user_id]);
                            } else {
                              setSelectedVolunteers((prev) => prev.filter((id) => id !== v.user_id));
                            }
                          }}
                          className="w-4 h-4 accent-blue-600"
                        />
                      </td>
                      <td className="py-3 px-4 font-medium text-gray-700">{index + 1}</td>
                      <td className="py-3 px-4 font-semibold text-gray-800">{v.user_first_name} {v.user_last_name}</td>
                      <td className="py-3 px-4 text-gray-600">{v.user_email}</td>
                      <td className="py-3 px-4 text-gray-600">{v.user_phone_number || "N/A"}</td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full border transition-all duration-300 ${
                          participated ? "bg-green-100 text-green-700 border-green-300" : "bg-red-100 text-red-700 border-red-300"
                        }`}>
                          {status}
                        </span>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <p className="text-gray-500">No volunteers have joined yet.</p>
      )}
    </div>
  );
};


const EventAnalytics = ({ event, volunteers, participationStatus }) => {
  // Calculate stats
  const participatedCount = Object.values(participationStatus).filter(
    (s) => s === "Participated"
  ).length;
  const totalRegistered = volunteers.length;
  const totalNeeded = event.need_count ?? 0;
  const participationRate =
    totalRegistered > 0 ? ((participatedCount / totalRegistered) * 100).toFixed(1) : 0;

  // Prepare data for charts
  const pieData = [
    { name: "Participated", value: participatedCount },
    { name: "Not Participated", value: totalRegistered - participatedCount },
  ];

  const COLORS = ["#34D399", "#F87171"];

  const barData = [
    { name: "Total Volunteers", count: totalRegistered },
    { name: "Needed Volunteers", count: totalNeeded },
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold text-blue-600 mb-6">Event Analytics</h2>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-100 p-4 rounded-xl border border-gray-200 shadow-sm text-center">
          <p className="text-sm text-gray-500">Total Needed</p>
          <p className="text-2xl font-bold">{totalNeeded}</p>
        </div>
        <div className="bg-gray-100 p-4 rounded-xl border border-gray-200 shadow-sm text-center">
          <p className="text-sm text-gray-500">Registered</p>
          <p className="text-2xl font-bold">{totalRegistered}</p>
        </div>
        <div className="bg-gray-100 p-4 rounded-xl border border-gray-200 shadow-sm text-center">
          <p className="text-sm text-gray-500">Participated</p>
          <p className="text-2xl font-bold">{participatedCount}</p>
        </div>
        <div className="bg-gray-100 p-4 rounded-xl border border-gray-200 shadow-sm text-center">
          <p className="text-sm text-gray-500">Participation Rate</p>
          <p className="text-2xl font-bold">{participationRate}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Participation Pie Chart */}
        <div className="bg-gray-100 p-4 rounded-xl shadow-sm border border-gray-200">
          <h3 className="font-semibold mb-4">Participation Status</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart for Volunteers vs Needed */}
        <div className="bg-gray-100 p-4 rounded-xl shadow-sm border border-gray-200">
          <h3 className="font-semibold mb-4">Volunteers vs Needed</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

