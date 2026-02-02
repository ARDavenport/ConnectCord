import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";
import connection from "../config/db.js";

const register = async (req, res) =>  {
    
    const {userID, firstName, middleName, lastName, email, passwords, phoneNumber, roles, city, state, createdAt} = req.body;

    // validate input
    if (!firstName || !lastName || !email || !passwords || !phoneNumber || !roles || !city || !state || !createdAt) {
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
        'INSERT INTO Users (userID, firstName, middleName, lastName, email, passwords, phoneNumber, roles, city, state, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [userID, firstName, middleName, lastName, email, hashedPassword, phoneNumber, roles, city, state, createdAt]
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
            roles,
            city,
            state,
            token
        }
    })

};

export { register }; // exprort all controllers

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