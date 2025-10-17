// src/contexts/EventContext.jsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback, // 1. Import useCallback
} from "react";
import api from "../api/axios";

const EventContext = createContext();
export const useEvent = () => useContext(EventContext);

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [currentEvent, setCurrentEvent] = useState(null);
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
  // 2. Wrap ALL functions in useCallback
  // ----------------------------
const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/event");
      
      // --- START FIX ---
      // 1. Extract the array from the response object
      const eventsList = res.data?.events || []; 
      
      // 2. Set the context state with the array, not the object
      setEvents(eventsList); 
      
      // 3. Return only the array, which is what the dashboard expects
      return eventsList; 
      // --- END FIX ---

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to fetch events");
      return [];
    } finally {
      setLoading(false);
    }
  }, []); // 3. Add empty dependency array

  // ----------------------------
  const fetchEvent = useCallback(async (event_id) => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get(`/event/${event_id}`);
      const evt = res.data?.event || res.data;
      setCurrentEvent(evt);
      return res.data;
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to fetch event");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // ----------------------------
  const fetchPublicEvents = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/event/public");
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
  }, []);

  // ----------------------------
  const createEvent = useCallback(async (formData) => {
    setLoading(true);
    setError("");
    try {
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
  }, []);

  // ----------------------------
  const updateEvent = useCallback(async (event_id, formData) => {
    setLoading(true);
    setError("");
    try {
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
  }, []);

  // ----------------------------
  const deleteEvent = useCallback(
    async (event_id) => {
      setLoading(true);
      setError("");
      try {
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
    },
    [currentEvent] // This function depends on currentEvent
  );

  // ----------------------------
  const updateEventStatus = useCallback(async (event_id, status) => {
    setLoading(true);
    setError("");
    try {
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
  }, []);

  // ----------------------------
  const addMember = useCallback(async (event_id, user_id) => {
    setLoading(true);
    setError("");
    try {
      const res = await api.post(`/event/${event_id}/add-member`, { user_id });
      return res.data;
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to add member");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ----------------------------
  const removeMember = useCallback(async (event_id, user_id) => {
    setLoading(true);
    setError("");
    try {
      const res = await api.delete(`/event/${event_id}/remove-member`, {
        data: { user_id },
      });
      return res.data;
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to remove member");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ----------------------------
  const removeAllMembers = useCallback(async (event_id) => {
    setLoading(true);
    setError("");
    try {
      const res = await api.delete(`/event/${event_id}/remove-all-members`);
      return res.data;
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to remove all members");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ----------------------------
  const getMembers = useCallback(async (event_id) => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get(`/event/${event_id}/members`);
      return res.data;
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to get members");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);


  const getEventsByUser = useCallback(async (user_id) => {

    try {
      const res = await api.get(`/event/member/${user_id}`);
      return res.data; // This will be { events: [...] } or just [...]
    
    } catch (err) {
      if (err.response && err.response.status === 404) {

        console.log("No registered events found for user (404 caught). Returning [].");
        return [];
      }
      

      console.error("A real error occurred fetching user events:", err);
      setError(err.response?.data?.message || "Failed to fetch user's events");
      return [];
    
    } 
    // We remove the 'finally' block because we are not
    // using the global 'setLoading(false)' for this function.
  }, []); // End of useCallback

  // ----------------------------
  const updateParticipation = useCallback(async (eventId, userId, status) => {
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/participation/update", {
        eventId,
        userId,
        status,
      });
      return res.data;
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to update participation");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ----------------------------
  const getParticipationForEvent = useCallback(async (eventId) => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get(`/participation/event/${eventId}`);
      console.log("backend vols :", res.data);
      return res.data;
    } catch (err){
      console.error(err);
      setError(err.response?.data?.message || "Failed to fetch participation");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <EventContext.Provider
      value={{
        events,
        currentEvent,
        loading,
        error,
        fetchEvents,
        fetchEvent,
        fetchPublicEvents,
        createEvent,
        updateEvent,
        deleteEvent,
        updateEventStatus,
        addMember,
        removeMember,
        removeAllMembers,
        getMembers,
        getEventsByUser,
        updateParticipation,
        getParticipationForEvent,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};