// frontend/src/pages/MyEvents.js
import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Box,
} from "@mui/material";
import api from "../../api/axios"; // your axios instance


const MyEvents = ({ userId }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
  const fetchEvents = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user?.user_id;   // or user._id depending on your schema

      if (!userId) {
        setError("User not logged in");
        setLoading(false);
        return;
      }

      const res = await api.get(`/events/member/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      setEvents(res.data.events || (res.data.event ? [res.data.event] : []));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  fetchEvents();
}, []);


  return (
    <>
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          My Registered Events
        </Typography>

        {loading ? (
          <Box display="flex" justifyContent="center">
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : events.length === 0 ? (
          <Alert severity="info">
            You haven't registered for any events yet.
          </Alert>
        ) : (
          <Grid container spacing={3}>
            {events.map((event) => (
              <Grid item xs={12} sm={6} md={4} key={event.event_id}>
                <Card>
                  {event.event_images?.length > 0 && (
                    <CardMedia
                      component="img"
                      height="200"
                      image={event.event_images[0]}
                      alt={event.event_name}
                    />
                  )}
                  <CardContent>
                    <Typography variant="h6">{event.event_name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {event.event_description}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      📅 {new Date(event.event_date).toLocaleDateString()}{" "}
                      <br />⏰ {event.event_time} <br />
                      📍 {event.event_venue}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </>
  );
};

export default MyEvents;
