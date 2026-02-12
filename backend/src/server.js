// import dotenv to use here, speciffaclly config
import { config } from "dotenv"; 
config();

import cors from "cors"; // import cors to handle cross-origin requests
import express from "express"; // import express
import connection from "./config/db.js";  // have one for connecting and disconnecting from database
import locationRoutes from "./routes/locationRoutes.js"; 

// Import Routes
import authRoutes from "./routes/authRoutes.js"; // import routes for authorization

// connect to database
//config();
//connection; // connect to database

const app = express(); // create a variable to put express in it as a middleware


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
const server = app.listen(process.env.PORT, "0.0.0.0", () => {
 console.log(`Server running on PORT ${process.env.PORT}`);
});


// Error Handling

// Handle unhandled promise rejections (e.g., database connection errors)
process.on("unhandledRejection", (err) => {
    console.error("Unhandled Rejection:", err);
    server.close(async () => {
        await connection.end();
        process.exit(1);
    });
});

// Handle uncaught exceptions
process.on("uncaughtException", async (err) => {
    console.error("Uncaught Exception:", err);
    await connection.end();
    process.exit(1);
});

// Graceful shutdown
process.on("SIGTERM", async () => {
    console.log("SIGTERM received, shutting down gracefully");
    server.close(async () => {
        await connection.end();
        process.exit(0);
    });
});



// was there a change?
  
