// server.js
require("dotenv").config(); // npm install dotenv
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise"); // Use promise-based API

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ─── MySQL Connection Pool (not single connection) ───
const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "Mickey2025!",
  database: process.env.DB_NAME || "connectcord",
  waitForConnections: true,
  connectionLimit: 10,
});

// ─── Verify DB on startup ───
(async () => {
  try {
    const conn = await db.getConnection();
    console.log("✅ Connected to MySQL database");
    conn.release();
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
    process.exit(1); // Don't run the server if DB is down
  }
})();

// ─── Health Check ───
app.get("/", (req, res) => {
  res.json({ status: "running", service: "ConnectCord Backend" });
});

// ─── POST /checkin ───
// ─── POST /checkin ───
app.post("/checkin", async (req, res) => {
  const { eventId, userId, timestamp } = req.body;

  if (!eventId || !userId) {
    return res.status(400).json({ error: "Missing required fields: eventId, userId" });
  }

  try {
    // Check for existing active check-in (no checkout yet)
    const [existing] = await db.query(
      "SELECT id, checkInTime FROM attendance WHERE eventId = ? AND userId = ? AND checkOutTime IS NULL",
      [eventId, userId]
    );

    if (existing.length > 0) {
      // Instead of rejecting, close the old session and start a new one
      console.log(`[CHECK-IN] Closing stale session for ${userId} at event ${eventId}`);
      
      await db.query(
        "UPDATE attendance SET checkOutTime = ? WHERE id = ?",
        [toMySQLDateTime(new Date().toISOString()), existing[0].id]
      );
    }

    const checkInTime = toMySQLDateTime(timestamp || new Date().toISOString());

    const [result] = await db.query(
      "INSERT INTO attendance (eventId, userId, checkInTime) VALUES (?, ?, ?)",
      [eventId, userId, checkInTime]
    );

    console.log(`[CHECK-IN] User ${userId} → Event ${eventId} at ${checkInTime}`);

    res.status(201).json({
      message: "Checked in successfully",
      attendanceId: result.insertId,
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
app.post("/checkout", async (req, res) => {
  const { eventId, userId, timestamp } = req.body;

  if (!eventId || !userId) {
    return res.status(400).json({ error: "Missing required fields: eventId, userId" });
  }

  try {
    // ─── Fix: Convert to MySQL-compatible format ───
    const checkOutTime = toMySQLDateTime(timestamp || new Date().toISOString());

    const [result] = await db.query(
      "UPDATE attendance SET checkOutTime = ? WHERE eventId = ? AND userId = ? AND checkOutTime IS NULL",
      [checkOutTime, eventId, userId]
    );

    if (result.affectedRows === 0) {
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

// ─── GET /attendance/:eventId (bonus: view attendance) ───
app.get("/attendance/:eventId", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM attendance WHERE eventId = ? ORDER BY checkInTime DESC",
      [req.params.eventId]
    );

    res.json({ eventId: req.params.eventId, records: rows });
  } catch (err) {
    console.error("[ATTENDANCE QUERY ERROR]", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 ConnectCord Backend running on port ${PORT}`);
});

// ─── Helper: Convert ISO timestamp to MySQL DATETIME format ───
const toMySQLDateTime = (isoString) => {
  const dt = new Date(isoString);
  return dt.toISOString().slice(0, 19).replace("T", " ");
  // "2026-02-19T00:08:05.967Z" → "2026-02-19 00:08:05"
};
