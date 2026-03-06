import express from "express";
import { register, login, logout, requestPasswordReset, resetPassword} from "../controllers/authController.js";
// creating controllers definiitons

const router = express.Router();

router.post("/register", register); // creating a user in the table

router.post("/login", login); // logging in a user

router.post("/logout", logout); // logging out a user

router.post("/request-password-reset", requestPasswordReset); // request password reset

router.post("/reset-password/:userID/:token", resetPassword); // reset password

// router.post('/check-email', checkEmail)

export default router;