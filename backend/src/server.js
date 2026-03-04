import { config } from "dotenv";
config();

import cors from "cors";
import express from "express";
import db from "./config/db.js";
import locationRoutes from "./routes/locationRoutes.js";

// Import Routes
import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors({
    origin: ['*', 'exp://localhost:8081'],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use("/auth", authRoutes);
app.use("/api/location", locationRoutes);
app.use("/api/profile", profileRoutes);


// ─── POST /checkin ───
app.post("/checkin", (req, res) => {
  const { eventId, userId, timestamp } = req.body;

  if (!eventId || !userId) {
    return res.status(400).json({ error: "Missing required fields: eventId, userId" });
  }

  try {
    const existing = db.prepare(
      "SELECT id FROM attendance WHERE eventId = ? AND userId = ? AND checkOutTime IS NULL"
    ).get(eventId, userId);

    if (existing) {
      return res.status(409).json({ error: "Already checked in to this event" });
    }

    const checkInTime = toSQLiteDateTime(timestamp || new Date().toISOString());

    const result = db.prepare(
      "INSERT INTO attendance (eventId, userId, checkInTime) VALUES (?, ?, ?)"
    ).run(eventId, userId, checkInTime);

    console.log(`[CHECK-IN] User ${userId} → Event ${eventId} at ${checkInTime}`);

    res.status(201).json({
      message: "Checked in successfully",
      attendanceId: result.lastInsertRowid,
      eventId,
      userId,
      checkInTime,
    });
  } catch (err) {
    console.error("[CHECK-IN ERROR]", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ─── POST /checkout ───
app.post("/checkout", (req, res) => {
  const { eventId, userId, timestamp } = req.body;

  if (!eventId || !userId) {
    return res.status(400).json({ error: "Missing required fields: eventId, userId" });
  }

  try {
    const checkOutTime = toSQLiteDateTime(timestamp || new Date().toISOString());

    const result = db.prepare(
      "UPDATE attendance SET checkOutTime = ? WHERE eventId = ? AND userId = ? AND checkOutTime IS NULL"
    ).run(checkOutTime, eventId, userId);

    if (result.changes === 0) {
      return res.status(404).json({ error: "No active check-in found for this event" });
    }

    console.log(`[CHECK-OUT] User ${userId} ← Event ${eventId} at ${checkOutTime}`);

    res.status(200).json({
      message: "Checked out successfully",
      eventId,
      userId,
      checkOutTime,
    });
  } catch (err) {
    console.error("[CHECK-OUT ERROR]", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ─── GET /attendance/:eventId ───
app.get("/attendance/:eventId", (req, res) => {
  try {
    const rows = db.prepare(
      "SELECT * FROM attendance WHERE eventId = ? ORDER BY checkInTime DESC"
    ).all(req.params.eventId);

    res.json({ eventId: req.params.eventId, records: rows });
  } catch (err) {
    console.error("[ATTENDANCE QUERY ERROR]", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 ConnectCord Backend running on port ${PORT}`);
});

// ─── Helper: Normalize ISO timestamp to SQLite DATETIME format ───
const toSQLiteDateTime = (isoString) => {
  const dt = new Date(isoString);
  return dt.toISOString().slice(0, 19).replace("T", " ");
  // "2026-02-19T00:08:05.967Z" → "2026-02-19 00:08:05"
};


// ─── Error Handling ───

process.on("unhandledRejection", (err) => {
    console.error("Unhandled Rejection:", err);
    server.close(() => {
        db.close();
        process.exit(1);
    });
});

process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception:", err);
    db.close();
    process.exit(1);
});

process.on("SIGTERM", () => {
    console.log("SIGTERM received, shutting down gracefully");
    server.close(() => {
        db.close();
        process.exit(0);
    });
});