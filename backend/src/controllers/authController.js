import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";
import connection from "../config/db.js";
import nodemailer from "nodemailer"; // use nodemailer for sending emails
import jwt from "jsonwebtoken";

const register = async (req, res) =>  {
    
    const {userID, firstName, middleName, lastName, email, passwords, phoneNumber, city, state, createdAt} = req.body;

    // validate input
    if (!firstName || !lastName || !email || !passwords || !phoneNumber || !city || !state || !createdAt) {
        return res.status(400).json({ message: "Please provide all required fields" });
    }

    // check if user already exists
    const [existingUser] = await connection.execute('SELECT * FROM Users WHERE email = ?', [email]); // see if the email exists already
    if (existingUser.length > 0) { // if it exists and isn't an empty array
        return res.status(400).json({ message: "User already exists, try another email" });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(passwords, salt);

    // insert user into database
    await connection.execute(
        'INSERT INTO Users (userID, firstName, middleName, lastName, email, passwords, phoneNumber, city, state, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [userID, firstName, middleName, lastName, email, hashedPassword, phoneNumber, city, state, createdAt]
    );

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
    })

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

// pre-req script to get mySQL time:
let now = new Date();
let mysqlTime = now.toISOString().slice(0, 19).replace('T', ' ');
pm.variables.set("mysqlTime", mysqlTime);
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
        const [users] = await connection.execute('SELECT * FROM Users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // get the first user from the array
        const user = users[0];

        // verify password -> FIXIT: fixed, user was getting multiple users so it was getting confused so I had to get the first user
        const validPassword = await bcrypt.compare(passwords, user.passwords);

        if(!validPassword) {
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
// fromat in postman:
/*
    "email": "joseph@gmail.com",
    "passwords": "Joseph123*"
*/


// logout controller
const logout = (req, res) => {
    try {
        res.cookie("jwt", "", { // error: es.cookie is not a function
            httpOnly: true,
            expires: new Date(0)
        });
        res.status(200).json({ message: "User logged out successfully" });    
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: "Error in logging out. Please try again." });
    };
    
};

// forgot password so have to do request a password reset
/*
Steps to do password reset:
    Create a route to request a password reset.
    Generate a password reset token.
    Send the reset token to the user’s email.
    Create a route to handle the password reset.
    Update the user’s password in the database.
*/

// reset password controller
// FIX-IT: 500 internal error TypeError: Cannot destructure property 'email' of 'req.body' as it is undefined.
const requestPasswordReset = async (req, res) => {
    const {email} = req.body; // get email from request

    try{
        // validate input
        if (!email) {
            return res.status(400).json({ error: "Please provide email" });
        }

        // users will be an array of users
        const [users] = await connection.execute('SELECT * FROM Users WHERE email = ?', [email]); // get the user with given email
        if(users.length === 0) {
            return res.status(404).json({ error: "User with this email does not exist" });
        }

        // get the first user from the array
        const user = users[0];

        // generate a reset token
        const secret = process.env.JWT_SECRET + user.passwords; // use password as part of secret to invalidate old tokens
        const payload = {
            id: user.userID,
            email: user.email
        };
        const token = jwt.sign(payload, secret, { expiresIn: '1h' }); // token valid for 1 hour

        const resetURL = `https://localhost:8000/auth/reset-password/${user.userID}/${token}`;

        // send email to user with reset link
        // using nodemailer to send email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER, // email 
                pass: process.env.EMAIL_PASS // password
            }
        });

        // mail options
        const mailOptions = {
            to: user.email,
            from: process.env.EMAIL_USER,
            subject: 'Password Reset Request',
            text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                  'Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n' +
                  `${resetURL}\n\n` +
                  'If you did not request this, please ignore this email and your password will remain unchanged.\n'
        };

        await transporter.sendMail(mailOptions); // send the email

        res.status(200).json({ message: "Password reset email sent.", resetURL}); // test the reset url
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error in sending password reset email. Please try again." });
    };
};

// reset password controller
// not sure how to set this up in postman
// what should the body and params be?
const resetPassword = async (req, res, next) => {
    const {userID, token} = req.params; // get id, token from params
    const {passwords} = req.body; // get new password from body

    try {
        const [users] = await connection.execute('SELECT * FROM Users WHERE userID = ?', [userID]); // get the user with given id
        
        console.log("Users found:", users.length); // Debug line

        if(users.length === 0) {
            return res.status(404).json({ error: "User does not exist." });
        }

        
        const user = users[0]; // get the first user from the array

        // secret to verify token
        const secret = process.env.JWT_SECRET + user.passwords;

        // verify token
        const verify = jwt.verify(token, secret);
        const hashedPassword = await bcrypt.hash(passwords, 10); // hash new password

        // update password in database
        await connection.execute('UPDATE Users SET passwords = ? WHERE userID = ?', [hashedPassword, userID]);

        res.status(200).json({ message: "Password has been reset successfully." });
    }  catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error in resetting password. Please try again." });
    };
};


export { register, login, logout, requestPasswordReset, resetPassword}; // exprort all controllers
// update them to route

