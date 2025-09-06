import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";

const EventContext = createContext();

export const useEvent = () => useContext(EventContext);

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([]);           // All events
  const [currentEvent, setCurrentEvent] = useState(null); // Selected event
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Set token once on mount
  useEffect(() => {
    const token = sessionStorage.getItem("accessToken");
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, []);

  // ----------------------------
  // Fetch all events
  // ----------------------------
  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/event");
      setEvents(res.data || []);
      return res.data;
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to fetch events");
      return [];
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------
  // Fetch single event by ID
  // ----------------------------
  const fetchEvent = async (event_id) => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get(`/event/${event_id}`);
      setCurrentEvent(res.data);
      return res.data;
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to fetch event");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------
  // Fetch all public events (no auth required)
  // ----------------------------
  const fetchPublicEvents = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/event/public"); // Make sure your backend supports this endpoint
      setEvents(res.data.events || []);
      return res.data;
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to fetch public events");
      setEvents([]);
      return [];
    } finally {
      setLoading(false);
    }
  };


  // ----------------------------
  // Create a new event
  // ----------------------------
  const createEvent = async (formData) => {
    try {
      setLoading(true);
      setError("");
      const res = await api.post("/event/event", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to create event");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------
  // Update an existing event
  // ----------------------------
  const updateEvent = async (event_id, formData) => {
    try {
      setLoading(true);
      setError("");
      const res = await api.put(`/event/${event_id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setCurrentEvent(res.data);
      return res.data;
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to update event");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------
  // Delete an event
  // ----------------------------
  const deleteEvent = async (event_id) => {
    try {
      setLoading(true);
      setError("");
      await api.delete(`/event/${event_id}`);
      setEvents((prev) => prev.filter((evt) => evt.event_id !== event_id));
      if (currentEvent?.event_id === event_id) setCurrentEvent(null);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to delete event");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------
  // Update event status
  // ----------------------------
  const updateEventStatus = async (event_id, status) => {
    try {
      setLoading(true);
      setError("");
      const res = await api.put(`/event/${event_id}/status`, { status });
      setEvents((prev) =>
        prev.map((evt) => (evt.event_id === event_id ? res.data : evt))
      );
      setCurrentEvent(res.data);
      return res.data;
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to update status");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------
  // Event members
  // ----------------------------
  const addMember = async (event_id, user_id) => {
    try {
      setLoading(true);
      setError("");
      const res = await api.post(`/event/${event_id}/add-member`, { user_id });
      return res.data;
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to add member");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeMember = async (event_id, user_id) => {
    try {
      setLoading(true);
      setError("");
      const res = await api.delete(`/event/${event_id}/remove-member`, { data: { user_id } });
      return res.data;
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to remove member");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeAllMembers = async (event_id) => {
    try {
      setLoading(true);
      setError("");
      const res = await api.delete(`/event/${event_id}/remove-all-members`);
      return res.data;
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to remove all members");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getMembers = async (event_id) => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get(`/event/${event_id}/members`);
      return res.data;
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to get members");
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getEventsByUser = async (user_id) => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get(`/event/member/${user_id}`);
      return res.data;
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to fetch user's events");
      return [];
    } finally {
      setLoading(false);
    }
  };

  return (
    <EventContext.Provider
      value={{
        events,
        currentEvent,
        loading,
        error,
        fetchEvents,
        fetchEvent,
        createEvent,
        updateEvent,
        deleteEvent,
        updateEventStatus,
        addMember,
        removeMember,
        removeAllMembers,
        getMembers,
        getEventsByUser,
        fetchPublicEvents
      }}
    >
      {children}
    </EventContext.Provider>
  );
};
