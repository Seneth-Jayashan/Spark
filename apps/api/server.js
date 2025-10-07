// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const apiRouter = require("./router");
const http = require("http");

const app = express();

// ---- Security & Logging ----
app.use(helmet());
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// ---- CORS ----
// Explicitly allow frontend origin(s)
const allowedOrigins = process.env.CORS_ORIGIN?.split(",") || ["http://localhost:5173"];
app.use(cors({
  origin: function(origin, callback) {
    // allow requests with no origin (like Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `CORS policy: origin ${origin} not allowed`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
}));

// ---- Body Parsing ----
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));
app.use(cookieParser());

// ---- Rate Limiting ----
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: Number(process.env.RATE_LIMIT_MAX || 300),
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// ---- Health Check ----
app.get("/health", (_req, res) => {
  res.status(200).json({
    service: "SPARK Volunteer Management System",
    status: "ok",
    time: new Date().toISOString(),
  });
});

// ---- Serve API ----
app.use("/api/v1", apiRouter);



// ---- Serve Uploads with proper CORS ----
app.use('/uploads', (req, res, next) => {
  const origin = req.headers.origin || "";
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  }

  // COEP / CORP headers for cross-origin embedding
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");

  // Handle preflight
  if (req.method === "OPTIONS") return res.sendStatus(200);

  next();
}, express.static(path.join(__dirname, 'uploads')));


// New: Chat model for saving messages
const Chat = require("./models/chatModel");

// Create HTTP server & wrap with Socket.io
const server = http.createServer(app); // Create HTTP server from Express app
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: { origin: "*" }
});

// Socket.io real-time chat handling
io.on("connection", (socket) => {
  console.log("🟢 Socket connected:", socket.id);

  // Join a event-specific room
  socket.on("join_event", ({ eventId }) => {
    const room = `event_${eventId}`;
    socket.join(room);
    console.log(`→ ${socket.id} joined ${room}`);
  });

  // Receive and broadcast a new chat message
  socket.on("send_message", async ({ eventId, sender_id, sender_role, message }) => {
    try {
      // Persist to Mongo
      const chat = await Chat.create({ eventId, sender_id, sender_role, message });
      const room = `event_${eventId}`;

      // Broadcast to everyone in this event room
      io.to(room).emit("receive_message", {
        _id: chat._id,
        eventId: chat.eventId,
        sender_id: chat.sender_id,
        sender_role: chat.sender_role,
        message: chat.message,
        timestamp: chat.timestamp,
      });
    } catch (err) {
      console.error("⚠️ Error saving chat or broadcasting:", err); // More descriptive error
    }
  });

  
  socket.on("disconnect", () => {
    console.log("🔴 Socket disconnected:", socket.id);
  });

  // Handle potential Socket.IO errors
  socket.on("error", (err) => {
    console.error("⚠️ Socket error:", err);
  });
});

// ---- 404 Handler ----
app.use((req, res, _next) => {
  res.status(404).json({
    error: "NotFound",
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

// ---- Error Handler ----
app.use((err, _req, res, _next) => {
  const status = err.status || 500;
  const isProd = process.env.NODE_ENV === "production";
  res.status(status).json({
    error: err.name || "ServerError",
    message: err.message || "Something went wrong",
    ...(isProd ? {} : { stack: err.stack }),
  });
});

// ---- Start Server ----
const PORT = Number(process.env.PORT || 5000);
connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`✔ Server running on port ${PORT}`);
    });
  })
  .catch((e) => {
    console.error("✖ Failed to connect DB:", e);
    process.exit(1);
  });
