import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";
import db from "../config/db.js";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

const register = async (req, res) =>  {
    
    const {userID, firstName, middleName, lastName, email, passwords, phoneNumber, city, state, createdAt} = req.body;

    // validate input
    if (!firstName || !lastName || !email || !passwords || !phoneNumber || !city || !state || !createdAt) {
        return res.status(400).json({ message: "Please provide all required fields" });
    }

    // check if user already exists
    const existingUser = db.prepare('SELECT * FROM Users WHERE email = ?').get(email);
    if (existingUser) {
        return res.status(400).json({ message: "User already exists, try another email" });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(passwords, salt);

    // insert user into database
    db.prepare(
        'INSERT INTO Users (userID, firstName, middleName, lastName, email, passwords, phoneNumber, city, state, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    ).run(userID, firstName, middleName, lastName, email, hashedPassword, phoneNumber, city, state, createdAt);

    // generate JWT token
    const token = generateToken(req.userID, res);

    // respond with success message
    res.status(201).json({
        status: "User Registered Successfully",
        data: {
            userID,
            firstName,
            middleName,
            lastName,
            email,
            phoneNumber,
            city,
            state,
            token
        }
    });
};
/*
// post request
{
    "userID": "{{$guid}}",
    "firstName": "Caroline",
    "middleName": null,
    "lastName": "Channing",
    "email": "caroline@gmail.com",
    "passwords": "Caroline123*",
    "phoneNumber": "9812347853",
    "roles": "user",
    "city": "Mt. Juliet",
    "state": "Tennessee",
    "createdAt": "{{mysqlTime}}"
}

// pre-req script to get time:
let now = new Date();
let time = now.toISOString().slice(0, 19).replace('T', ' ');
pm.variables.set("mysqlTime", time);
*/

// login controller
const login = async (req, res) => {
    try {
        const { email, passwords } = req.body;

        // validate input
        if (!email || !passwords) {
            return res.status(400).json({ error: "Please provide email and password" });
        }

        // check if user email exists in the table
        const user = db.prepare('SELECT * FROM Users WHERE email = ?').get(email);
        if (!user) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // verify password
        const validPassword = await bcrypt.compare(passwords, user.passwords);
        if (!validPassword) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // generate JWT token
        const token = generateToken(user.userID, res);

        // give the result
        res.status(200).json({
            status: "User Logged In Successfully",
            data: {
                userID: user.userID,
                email: user.email,
                token
            }
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: "Internal Server Error" });
    };
};
// format in postman:
/*
    "email": "joseph@gmail.com",
    "passwords": "Joseph123*"
*/


// logout controller
const logout = (req, res) => {
    try {
        res.cookie("jwt", "", {
            httpOnly: true,
            expires: new Date(0)
        });
        res.status(200).json({ message: "User logged out successfully" });    
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: "Error in logging out. Please try again." });
    };
};

// forgot password - request a password reset
/*
Steps to do password reset:
    Create a route to request a password reset.
    Generate a password reset token.
    Send the reset token to the user's email.
    Create a route to handle the password reset.
    Update the user's password in the database.
*/

const requestPasswordReset = async (req, res) => {
    const {email} = req.body;

    try {
        // validate input
        if (!email) {
            return res.status(400).json({ error: "Please provide email" });
        }

        // get the user with given email
        const user = db.prepare('SELECT * FROM Users WHERE email = ?').get(email);
        if (!user) {
            return res.status(404).json({ error: "User with this email does not exist" });
        }

        // generate a reset token
        const secret = process.env.JWT_SECRET + user.passwords;
        const payload = {
            id: user.userID,
            email: user.email
        };
        const token = jwt.sign(payload, secret, { expiresIn: '1h' });

        const resetURL = `https://localhost:8000/auth/reset-password/${user.userID}/${token}`;

        // send email to user with reset link using nodemailer
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            to: user.email,
            from: process.env.EMAIL_USER,
            subject: 'Password Reset Request',
            text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                  'Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n' +
                  `${resetURL}\n\n` +
                  'If you did not request this, please ignore this email and your password will remain unchanged.\n'
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: "Password reset email sent.", resetURL });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error in sending password reset email. Please try again." });
    };
};

const resetPassword = async (req, res, next) => {
    const {userID, token} = req.params;
    const {passwords} = req.body;

    try {
        const user = db.prepare('SELECT * FROM Users WHERE userID = ?').get(userID);
        
        console.log("User found:", !!user); // Debug line

        if (!user) {
            return res.status(404).json({ error: "User does not exist." });
        }

        // secret to verify token
        const secret = process.env.JWT_SECRET + user.passwords;

        // verify token
        const verify = jwt.verify(token, secret);
        const hashedPassword = await bcrypt.hash(passwords, 10);

        // update password in database
        db.prepare('UPDATE Users SET passwords = ? WHERE userID = ?').run(hashedPassword, userID);

        res.status(200).json({ message: "Password has been reset successfully." });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error in resetting password. Please try again." });
    };
};

const checkEmail = async (req, res) => {
    try {
        const { email } = req.body;
        const user = db.prepare('SELECT * FROM Users WHERE email = ?').get(email);
        res.json({ exists: !!user });
    } catch (error) {
        console.error('Error checking email:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

export { register, login, logout, requestPasswordReset, resetPassword, checkEmail };