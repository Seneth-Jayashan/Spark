import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useEvent } from "../../contexts/EventContext";
import { Link, useNavigate } from "react-router-dom";
import {
  Calendar,
  MapPin,
  Clock,
  User,
  LogOut,
  ArrowRight,
  Loader,
  AlertTriangle,
  CheckCircle,
  Inbox,
} from "lucide-react";
import { motion } from "framer-motion";

export default function VolunteerDashboard() {
  const { user, logout } = useAuth();
  const { getEventsByUser } = useEvent();
  const navigate = useNavigate();

  const [myEvents, setMyEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Data Fetching
  useEffect(() => {
    if (user?.user_id) {
      const fetchMyEvents = async () => {
        try {
          setLoading(true);
          setError(null);
          const eventsData = await getEventsByUser(user.user_id);

          let eventsList = [];
          if (Array.isArray(eventsData)) {
            eventsList = eventsData;
          } else if (eventsData && Array.isArray(eventsData.events)) {
            eventsList = eventsData.events;
          }

          // Sort events by date, most recent first
          eventsList.sort(
            (a, b) => new Date(b.event_date) - new Date(a.event_date)
          );
          setMyEvents(eventsList);
        } catch (err) {
          setError("Failed to load your events.");
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchMyEvents();
    } else {
      setLoading(false); // No user, so not loading
    }
  }, [user?.user_id, getEventsByUser]);

  // Handle Logout
  const handleLogout = () => {
    logout();
    navigate("/login"); // Redirect to login after logout
  };

  // Filter events into upcoming and past
  const today = new Date().toISOString().split("T")[0];
  const upcomingEvents = myEvents.filter(
    (e) => e.event_date && e.event_date >= today
  );
  const pastEvents = myEvents.filter(
    (e) => e.event_date && e.event_date < today
  );

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-amber-50 flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Loader className="w-16 h-16 text-blue-900 animate-spin mx-auto mb-4" />
          <p className="text-blue-900 font-medium">Loading dashboard...</p>
        </motion.div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-amber-50 flex items-center justify-center">
        <motion.div
          className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md mx-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="text-red-500 text-xl" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Oops!</h2>
          <p className="text-red-500">{error}</p>
        </motion.div>
      </div>
    );
  }

  // Main Dashboard UI
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-amber-50 p-4 md:p-8">
      <motion.div
        className="max-w-7xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-blue-900">
            Welcome back, {user?.first_name}! 👋
          </h1>
          <p className="text-gray-600 mt-2 text-lg">
            Here's what's happening in your volunteer world.
          </p>
        </motion.div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Column 1: Profile & Stats */}
          <div className="lg:col-span-1 space-y-8">
            {/* Profile Card */}
            <motion.div
              className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100"
              whileHover={{ y: -5 }}
            >
              <img
                src={
                  user.profile_pic
                    ? `${import.meta.env.VITE_SERVER_URL}${user.profile_pic}`
                    : `https://ui-avatars.com/api/?name=${user.first_name}+${
                        user.last_name
                      }&background=0B2545&color=FFB238&bold=true`
                }
                alt="Profile"
                className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-blue-100 shadow-sm"
              />
              <h3 className="text-center text-xl font-bold text-blue-900">
                {user.first_name} {user.last_name}
              </h3>
              <p className="text-center text-gray-500 mb-4">{user.email}</p>

              <Link
                to="/dashboard/volunteer/profile" // <-- Adjust this link to your profile page
                className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-blue-100 text-blue-900 rounded-xl font-semibold hover:bg-blue-200 transition-colors"
              >
                <User size={18} />
                Edit Profile
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 w-full px-4 py-3 mt-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
              >
                <LogOut size={18} />
                Logout
              </button>
            </motion.div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                className="bg-white p-4 rounded-2xl shadow-lg border border-gray-100"
                whileHover={{ y: -5 }}
              >
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mb-2">
                  <Calendar className="text-blue-900" />
                </div>
                <p className="text-sm text-gray-500">Upcoming</p>
                <p className="text-2xl font-bold text-blue-900">
                  {upcomingEvents.length}
                </p>
              </motion.div>
              <motion.div
                className="bg-white p-4 rounded-2xl shadow-lg border border-gray-100"
                whileHover={{ y: -5 }}
              >
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mb-2">
                  <CheckCircle className="text-green-700" />
                </div>
                <p className="text-sm text-gray-500">Total Events</p>
                <p className="text-2xl font-bold text-green-700">
                  {myEvents.length}
                </p>
              </motion.div>
            </div>
          </div>

          {/* Column 2: Event Lists */}
          <div className="lg:col-span-2 space-y-8">
            {/* Upcoming Events */}
            <motion.div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
              <h2 className="text-2xl font-bold text-blue-900 mb-4">
                My Upcoming Events
              </h2>
              <div className="space-y-4">
                {loading ? (
                  <p>Loading events...</p>
                ) : upcomingEvents.length > 0 ? (
                  upcomingEvents.map((event) => (
                    <EventCard key={event.event_id} event={event} />
                  ))
                ) : (
                  <EmptyState
                    message="You have no upcoming events."
                    actionText="Find Events to Join"
                    actionLink="/dashboard/volunteer/events" // Link to all events page
                  />
                )}
              </div>
            </motion.div>

            {/* Past Events */}
            <motion.div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
              <h2 className="text-2xl font-bold text-blue-900 mb-4">
                My Event History
              </h2>
              <div className="space-y-4">
                {loading ? (
                  <p>Loading history...</p>
                ) : pastEvents.length > 0 ? (
                  pastEvents.map((event) => (
                    <EventCard key={event.event_id} event={event} isPast />
                  ))
                ) : (
                  <EmptyState message="You have no past events." />
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// --- Reusable Event Card Component ---
const EventCard = ({ event, isPast = false }) => (
  <Link
    to={`/dashboard/volunteer/myevents/${event.event_id}`}
    className={`flex flex-col md:flex-row items-center gap-4 p-4 border rounded-2xl hover:shadow-md transition-all ${
      isPast ? "bg-gray-50 opacity-70" : "bg-white hover:border-blue-200"
    }`}
  >
    <img
      src={
        event.event_images?.[0]
          ? `${import.meta.env.VITE_SERVER_URL}${event.event_images[0]}`
          : "https://via.placeholder.com/150" // Fallback
      }
      alt={event.event_name}
      className="w-full h-32 md:w-28 md:h-20 rounded-lg object-cover"
    />
    <div className="flex-1">
      <p
        className={`font-bold text-lg ${
          isPast ? "text-gray-600" : "text-blue-900"
        }`}
      >
        {event.event_name}
      </p>
      <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
        <Calendar size={14} />
        <span>{event.event_date?.split("T")[0]}</span>
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
        <MapPin size={14} />
        <span>{event.event_venue}</span>
      </div>
    </div>
    <ArrowRight
      className={`w-6 h-6 flex-shrink-0 ${
        isPast ? "text-gray-400" : "text-blue-900"
      }`}
    />
  </Link>
);

// --- Reusable Empty State Component ---
const EmptyState = ({ message, actionText, actionLink }) => (
  <div className="text-center py-8">
    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
      <Inbox className="text-gray-400 text-3xl" />
    </div>
    <p className="text-gray-500 mb-4">{message}</p>
    {actionText && actionLink && (
      <Link
        to={actionLink}
        className="px-5 py-2 bg-[#FFB238] text-blue-900 rounded-full font-semibold hover:opacity-90 transition-opacity"
      >
        {actionText}
      </Link>
    )}
  </div>
);