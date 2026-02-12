import express from "express";
import fetch from "node-fetch"; // make sure installed
const router = express.Router();

// Make sure dotenv is loaded if server.js hasn't run it (optional)
import dotenv from "dotenv";
dotenv.config();

const CSC_API_KEY = process.env.CSC_API_KEY;
const BASE_URL = "https://api.countrystatecity.in/v1";

// --- GET all states in US ---
router.get("/states", async (req, res) => {
  if (!CSC_API_KEY) {
    return res.status(500).json({ message: "CSC_API_KEY is missing" });
  }

  try {
    const response = await fetch(`${BASE_URL}/countries/US/states`, {
      headers: {
        "X-CSCAPI-KEY": CSC_API_KEY,
        Accept: "application/json",
      },
    });

    const data = await response.json();

    // Check if API returned an error
    if (data.status === "error") {
      return res.status(500).json({ message: data.message });
    }

    res.json(data); // send states to frontend
  } catch (err) {
    console.error("Error fetching states:", err);
    res.status(500).json({ message: "Failed to fetch states" });
  }
});

// --- GET cities for a specific state ---
router.get("/states/:stateCode/cities", async (req, res) => {
  const { stateCode } = req.params;

  if (!CSC_API_KEY) {
    return res.status(500).json({ message: "CSC_API_KEY is missing" });
  }

  try {
    const response = await fetch(
      `${BASE_URL}/countries/US/states/${stateCode}/cities`,
      {
        headers: {
          "X-CSCAPI-KEY": CSC_API_KEY,
          Accept: "application/json",
        },
      }
    );

    const data = await response.json();

    if (data.status === "error") {
      return res.status(500).json({ message: data.message });
    }

    res.json(data); // send cities to frontend
  } catch (err) {
    console.error("Error fetching cities:", err);
    res.status(500).json({ message: "Failed to fetch cities" });
  }
});

export default router;
