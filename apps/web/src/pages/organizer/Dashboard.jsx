import React, { useEffect, useState } from "react";
import { useOrg } from "../../contexts/OrgContext";
import { useEvent } from "../../contexts/EventContext";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Loader,
  AlertTriangle,
  Calendar,
  Users,
  Plus,
  ArrowRight,
  Building,
  Inbox,
} from "lucide-react";

// --- Reusable Stat Card Component (No Change) ---
const StatCard = ({ title, value, icon, color }) => (
  <motion.div
    className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100"
    whileHover={{ y: -5 }}
  >
    <div
      className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center mb-3`}
    >
      {icon}
    </div>
    <p className="text-sm text-gray-500">{title}</p>
    <p className="text-3xl font-bold text-blue-900">{value}</p>
  </motion.div>
);

// --- Reusable Event Card Component (No Change) ---
const EventCard = ({ event }) => (
  <Link
    to={`/dashboard/organizer/event/view/${event.event_id}`}
    className="flex flex-col md:flex-row items-center gap-4 p-4 bg-white border rounded-2xl hover:shadow-md transition-all hover:border-blue-200"
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
      <p className="font-bold text-lg text-blue-900">{event.event_name}</p>
      <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
        <Calendar size={14} />
        <span>{event.event_date?.split("T")[0]}</span>
      </div>
    </div>
    <ArrowRight className="w-6 h-6 text-blue-900 flex-shrink-0" />
  </Link>
);

// --- Main Dashboard Component ---
export default function Dashboard() {
  const { currentOrg, loading: orgLoading } = useOrg();
  const { fetchEvents, getMembers } = useEvent();
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState({
    totalEvents: 0,
    upcoming: 0,
    totalVolunteers: 0,
  });
  const [dataLoading, setDataLoading] = useState(true);
  // Fetch all dashboard data (events, stats)
  useEffect(() => {
    if (currentOrg) {
      const loadDashboardData = async () => {
        try {
          setDataLoading(true);
          
          // 1. Fetch ALL events from the context
          const allEvents = await fetchEvents();

          if (!Array.isArray(allEvents)) {
            console.error("fetchEvents did not return an array:", allEvents);
            setEvents([]);
            return;
          }

          // --- START OF FIX ---
          // 2. Filter events to show only this organizer's
          //    IMPORTANT: Check your database for the correct field names.
          //    I am assuming 'event.organization' and 'currentOrg.org_id'
          //    It might be 'event.org_id' or 'event.organization_id'.
          const orgEvents = allEvents.filter(
            (event) => event.event_org === currentOrg.organization.org_id 
          );
          // --- END OF FIX ---


          // 3. Calculate stats (using the filtered orgEvents)
          const today = new Date().toISOString().split("T")[0];
          const upcomingEvents = orgEvents.filter(
            (e) => e.event_date && e.event_date >= today
          );

          // 4. Fetch volunteer counts (using the filtered orgEvents)
          let totalVolunteers = 0;
          if (orgEvents.length > 0) {
            const memberPromises = orgEvents.map((event) =>
              getMembers(event.event_id)
            );
            const memberResults = await Promise.all(memberPromises);

            memberResults.forEach((result) => {
              totalVolunteers += result?.members?.length || 0;
            });
          }

          // 5. Set all state
          setEvents(
            orgEvents.sort(
              (a, b) => new Date(b.event_date) - new Date(a.event_date)
            )
          );
          setStats({
            totalEvents: orgEvents.length,
            upcoming: upcomingEvents.length,
            totalVolunteers: totalVolunteers,
          });
        } catch (err) {
          console.error("Failed to load dashboard data", err);
        } finally {
          setDataLoading(false);
        }
      };
      loadDashboardData();
    }
  }, [currentOrg, fetchEvents, getMembers]);

  // --- 1. Initial Loading State (Waiting for Org check) ---
  if (orgLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-amber-50">
        <Loader className="w-12 h-12 text-blue-900 animate-spin" />
        <p className="text-gray-600 ml-4 text-lg">
          Loading organization info...
        </p>
      </div>
    );
  }

  // --- 2. No Organization Found State ---
  if (!currentOrg) {
    return (
      <div className="p-6 min-h-screen bg-gradient-to-br from-blue-50 to-amber-50">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-6 py-6 rounded-lg shadow-md max-w-lg mx-auto">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 flex-shrink-0" />
            <h2 className="text-xl font-semibold">No Organization Found</h2>
          </div>
          <p className="mt-2">
            You haven’t created an organization yet. Please create one to
            manage your events.
          </p>
          <button
            onClick={() => navigate("/dashboard/organizer/org/create")}
            className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded-lg font-semibold"
          >
            Create Organization
          </button>
        </div>
      </div>
    );
  }

  // --- 3. Main Dashboard (Organization Exists) ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-amber-50 p-4 md:p-8">
      <motion.div
        className="max-w-7xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header & Quick Actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-blue-900">
              Welcome, {currentOrg.organization.org_name}
            </h1>
            <p className="text-gray-600 mt-2 text-lg">
              Here's an overview of your organization's activity.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/dashboard/organizer/org/update" 
              className="flex items-center gap-2 px-4 py-3 bg-white text-blue-900 rounded-xl font-semibold hover:bg-blue-100 transition-colors shadow-md border"
            >
              <Building size={18} />
              Manage Org
            </Link>
            <Link
              to="/dashboard/organizer/event/create" 
              className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg"
            >
              <Plus size={18} />
              New Event
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Total Events"
            value={
              dataLoading ? (
                <Loader size={24} className="animate-spin" />
              ) : (
                stats.totalEvents
              )
            }
            icon={<Calendar className="text-blue-900" />}
            color="bg-blue-100"
          />
          <StatCard
            title="Upcoming Events"
            value={
              dataLoading ? (
                <Loader size={24} className="animate-spin" />
              ) : (
                stats.upcoming
              )
            }
            icon={<Calendar className="text-orange-700" />}
            color="bg-orange-100"
          />
          <StatCard
            title="Total Volunteers"
            value={
              dataLoading ? (
                <Loader size={24} className="animate-spin" />
              ) : (
                stats.totalVolunteers
              )
            }
            icon={<Users className="text-green-700" />}
            color="bg-green-100"
          />
        </div>

        {/* Event List */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <h2 className="text-2xl font-bold text-blue-900 mb-4">
            My Created Events
          </h2>
          {dataLoading ? (
            <p className="text-gray-500">Loading your events...</p>
          ) : (
            <div className="space-y-4">
              {events.length > 0 ? (
                events.map((event) => (
                  <EventCard key={event.event_id} event={event} />
                ))
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Inbox className="text-gray-400 text-3xl" />
                  </div>
                  <p className="text-gray-500">
                    You haven't created any events yet.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}