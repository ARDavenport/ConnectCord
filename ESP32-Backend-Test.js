const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Create MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Mickey2025!',
  database: 'connectcord'
});

db.connect(err => {
  if (err) {
    console.error('Database connection failed:', err);
  } else {
    console.log('Connected to MySQL database');
  }
});

app.listen(PORT, () => {
    console.log('Listening on port ', PORT)
})

const arrAttendanceLog = []

// Health check route for testing API
app.get('/', (req,res) => {
    res.send('ConnectCord Backend is running')
})

// Test endpoint that allows the ESP32 to notify th backend that it is active
app.post('/beacon', (req, res) => {
  const { deviceId, eventId, timestamp } = req.body;

  if (!deviceId || !eventId) {
    return res.status(400).json({ error: 'Missing deviceId or eventId' });
  }

  const sql = `
    INSERT INTO attendance (deviceId, eventId, timestamp)
    VALUES (?, ?, ?)
  `;

  db.query(sql, [deviceId, eventId, timestamp], (err, result) => {
    if (err) {
      console.error('Database insert error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    res.status(200).json({ message: 'Beacon stored successfully' });
  });
});
