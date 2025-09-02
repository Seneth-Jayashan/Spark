// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const apiRouter = require("./router");

const app = express();

app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(",") || "*",
  credentials: true
}));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}
app.use(cookieParser());


const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: Number(process.env.RATE_LIMIT_MAX || 300),
  standardHeaders: true,
  legacyHeaders: false
});
app.use(limiter);

app.get("/health", (_req, res) => {
  res.status(200).json({
    service: "SPARK Volunteer Management System",
    status: "ok",
    time: new Date().toISOString()
  });
});

// -- API
app.use("/api/v1", apiRouter);

// -- 404
app.use((req, res, _next) => {
  res.status(404).json({
    error: "NotFound",
    message: `Route ${req.method} ${req.originalUrl} not found`
  });
});

app.use((err, _req, res, _next) => {
  const status = err.status || 500;
  const isProd = process.env.NODE_ENV === "production";
  res.status(status).json({
    error: err.name || "ServerError",
    message: err.message || "Something went wrong",
    ...(isProd ? {} : { stack: err.stack })
  });
});

const PORT = Number(process.env.PORT || 5000);
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✔ Server running on port : ${PORT}`);
    });
  })
  .catch((e) => {
    console.error("✖ Failed to connect DB:", e);
    process.exit(1);
  });
