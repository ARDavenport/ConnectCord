// import dotenv to use here, speciffaclly config
import { config } from "dotenv"; 
config();

import cors from "cors"; // import cors to handle cross-origin requests
import express from "express"; // import express
import connection from "./config/db.js";  // have one for connecting and disconnecting from database
import locationRoutes from "./routes/locationRoutes.js"; 
import mysql from 'mysql2'

// Import Routes
import authRoutes from "./routes/authRoutes.js"; // import routes for authorization

// connect to database
//config();
//connection; // connect to database

const app = express(); // create a variable to put express in it as a middleware
const PORT = process.env.PORT || 3000;



// Middlewares
app.use(cors({
    origin: ['*', 'exp://localhost:8081'],
    credentials: true
})); // use cors as a middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// API Routes
app.use("/auth", authRoutes); // authorization routes
app.use("/api/location", locationRoutes); 


// Listen on port
//const server = app.listen(process.env.PORT, "0.0.0.0", () => {
// console.log(`Server running on PORT ${process.env.PORT}`);
//});


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