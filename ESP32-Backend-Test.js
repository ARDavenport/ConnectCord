const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.listen(PORT, () => {
    console.log('Listening on port ', PORT)
})

const arrAttendanceLog = []

// Health check route for testing API
app.get('/', (req,res) => {
    res.send('ConnectCord Backend is running')
})

// Test endpoint that allows the ESP32 to notify the backend that it is active
app.post('/beacon', (req, res) => {
  const { deviceId, eventId, timestamp } = req.body;

  if (!deviceId || !eventId) {
    return res.status(400).json({ error: 'Missing deviceId or eventId' })
  }

  console.log('Beacon registered:', {
    deviceId,
    eventId,
    timestamp
  })

  res.status(200).json({ message: 'Beacon received successfully' });
})
