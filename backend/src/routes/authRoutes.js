import express from "express";
import {register } from "../controllers/authController.js";
// creating controllers definiitons

const router = express.Router();

router.post("/register", register); // creating a user in the table

// router.post("/login", login);

// router.post("/logout", logout);

export default router;