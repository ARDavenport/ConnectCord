// import dotenv to use here, speciffaclly config
import { config } from "dotenv"; 
import express from "express"; // import express
// have one for connecting and disconnecting from database

// Import Routes
import authRoutes from "./routes/authRoutes.js"; // import routes for authorization

// connect to database
config();
// connectDB();


const app = express(); // create a variable to put express in it as a middleware

// Middlewares
app.use(cors());
app.use(express.json());

// API Routes
app.use("/auth", authRoutes); // authorization routes


// Listen on port
const server = app.listen(process.env.PORT, "0.0.0.0", () => {
    console.log(`Server running on PORT ${process.env.PORT}`);
});

// Error Handling

// Handle unhandled promise rejections (e.g., database connection errors)
process.on("unhandledRejection", (err) => {
    console.error("Unhandled Rejection:", err);
    server.close(async () => {
        await disconnectDB();
        process.exit(1);
    });
});

// Handle uncaught exceptions
process.on("uncaughtException", async (err) => {
    console.error("Uncaught Exception:", err);
    await disconnectDB();
    process.exit(1);
});

// Graceful shutdown
process.on("SIGTERM", async () => {
    console.log("SIGTERM received, shutting down gracefully");
    server.close(async () => {
        await disconnectDB();
        process.exit(0);
    });
});




  
