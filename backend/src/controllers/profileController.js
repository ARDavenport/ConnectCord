/*
CREATE TABLE Profiles (
  profileID VARCHAR(100), -- connected to userid
  fullName TEXT NOT NULL,
  bio TEXT NOT NULL,
  mail TEXT,
  phone VARCHAR(50),
  resumeURL VARCHAR(500)
  linkedinURL VARCHAR(200),
  githubURL VARCHAR(200),
  portfolioURL VARCHAR(200),
  skills TEXT,
  FOREIGN KEY (profileID)
  REFERENCES Users (userID)
);

-- one profile can have multiple experience, education, certification

CREATE TABLE Experiences (
  id INT PRIMARY KEY AUTO_INCREMENT,
  profileID VARCHAR(100) NOT NULL,
  roleName VARCHAR(200) NOT NULL,
  companyName VARCHAR(200) NOT NULL,
  startDate DATE NOT NULL,
  endDate DATE, -- this can be marked as null and when it is null it will be taken as present
  city VARCHAR(500),
  state VARCHAR(500),
  description TEXT,
  FOREIGN KEY (profileID)
  REFERENCES Profiles (profileID)
);

-- includes high school and any college or technical school stuff
CREATE TABLE Educations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  profileID VARCHAR(100) NOT NULL,
  schoolName VARCHAR(500) NOT NULL,
  degree VARCHAR(500) NOT NULL,
  fieldOfStudy VARCHAR(500) NOT NULL,
  startDate DATE NOT NULL,
  endDate DATE, -- can be null for present
  gpa FLOAT, -- optional
  description TEXT, -- optional
  FOREIGN KEY (profileID)
  REFERENCES Profiles (profileID)
);

CREATE TABLE Certifications (
  id INT PRIMARY KEY AUTO_INCREMENT,
  profileID VARCHAR(100) NOT NULL,
  certificationName VARCHAR(500) NOT NULL,
  organization VARCHAR(500) NOT NULL,
  startDate DATE NOT NULL,
  endDate DATE,
  credentialID VARCHAR(500) NOT NULL,
  credentialURL varchar(500) NOT NULL,
  FOREIGN KEY (profileID)
  REFERENCES Profiles (profileID)
);

*/

import connection from "../config/db.js";
import nodemailer from "nodemailer"; // use nodemailer for sending emails

const createProfile = async (req, res) => {
    try {
        const { profileID, 
                fullName,
                bio,
                mail,
                phone,
                resumeURL,
                linkedinURL,
                githubURL,
                portfolioURL,
                skills
        } = req.body;

        // check if user already exists for the ID
        const [existingUser] = await connection.execute('SELECT * FROM Users WHERE userID = ?', [profileID]); // see if the email exists already
        if (existingUser.length > 0) { // if it exists and isn't an empty array
            return res.status(400).json({ message: "User already exists, try another email" });
        }

        // insert profile into database
        await connection.execute(
            'INSERT INTO Profiles (profileID, fullName, bio, mail, phone, resumeURL, linkedinURL, githubURL, portfolioURL, skills) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
                profileID, 
                fullName, 
                normalize(bio), 
                mail, 
                phone, 
                normalize(resumeURL), 
                normalize(linkedinURL), 
                normalize(githubURL), 
                normalize(portfolioURL), 
                normalize(skills)
            ]
        );

        // respond with success message
    res.status(201).json({
        status: "Profile created successfully",
        data: {
            profileID,
            fullName,
            bio,
            mail,
            phone,
            linkedinURL,
            githubURL,
            portfolioURL,
            skills
        }
    })

    } catch(error) {
        console.log(error.message);
        res.status(500).json({ message: "Internal Server Error", error: error.message }); 
    };
};

const normalize = (input) => {
    if (input === null || input === undefined) {
        return null;
    } else {     
        return input.trim();     
    }
};

const addExperience = async (req, res) => {
    try {
        const { profileID, roleName, companyName, startDate, endDate, city, state, description } = req.body;

        // check if profile exists for the ID
        const [existingProfile] = await connection.execute('SELECT * FROM Profiles WHERE profileID = ?', [profileID]); // see if the email exists already
        if (existingProfile.length === 0) { // if it doesn't exist or is an empty array
            return res.status(400).json({ message: "Profile does not exist, create profile first" });
        }

        // insert experience into database
        await connection.execute(
            'INSERT INTO Experiences (profileID, roleName, companyName, startDate, endDate, city, state, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [
                profileID, 
                roleName, 
                companyName, 
                startDate, 
                normalize(endDate), 
                normalize(city), 
                normalize(state), 
                normalize(description)
            ]
        );

        // result
        res.status(200).json({
            status: "Experience added successfully",
            data: {
                roleName,
                companyName,
                startDate,
                endDate,
                city,
                state,
                description
            }
        });

    } catch(error) {
        console.log(error.message);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    };
};

const addEducation = async (req, res) => {
    try {
        const { profileID, schoolName, degree, fieldOfStudy, startDate, endDate, gpa, description } = req.body;

        // check if profile exists for the ID
        const [existingProfile] = await connection.execute('SELECT * FROM Profiles WHERE profileID = ?', [profileID]); // see if the email exists already
        if (existingProfile.length === 0) { // if it doesn't exist or is an empty array
            return res.status(400).json({ message: "Profile does not exist, create profile first" });
        }

        // insert education into database
        await connection.execute(
            'INSERT INTO Educations (profileID, schoolName, degree, fieldOfStudy, startDate, endDate, gpa, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [
                profileID,
                schoolName,
                degree,
                fieldOfStudy,
                startDate,
                normalize(endDate), // null can be passed as endDate for present
                normalize(gpa),
                normalize(description)
            ]
        );

        // result
        res.status(200).json({
            status: "Education added successfully",
            data: {
                profileID,
                schoolName,
                degree,
                fieldOfStudy,
                startDate,
                endDate,
                gpa,
                description
            }
        });

    } catch(error) {
        console.log(error.message);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    };
};

const addCertification = async (req, res) => {
    try {
        const { profileID, certificationName, organization, startDate, endDate, credentialID, credentialURL } = req.body;

        // check if profile exists for the ID
        const [existingProfile] = await connection.execute('SELECT * FROM Profiles WHERE profileID = ?', [profileID]); // see if the email exists already
        if (existingProfile.length === 0) { // if it doesn't exist or is an empty array
            return res.status(400).json({ message: "Profile does not exist, create profile first" });
        }

        // insert certification into database
        await connection.execute(
            'INSERT INTO Certifications (profileID, certificationName, organization, startDate, endDate, credentialID, credentialURL) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [
                profileID,
                certificationName,
                organization,
                startDate,
                normalize(endDate), // null can be passed as endDate for present
                credentialID,
                credentialURL
            ]
        ); 
        
        // result
        res.status(200).json({
            status: "Certification added successfully",
            data: {
                certificationName,
                organization,
                startDate,
                endDate,
                credentialID,
                credentialURL
            }
        });
    
    } catch(error) {
        console.log(error.message);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    };
};

const getFullProfile = async (req, res) => {
    try {
        const { profileID } = req.params;

        // check if profile exists for the ID
        const [existingProfile] = await connection.execute('SELECT * FROM Profiles WHERE profileID = ?', [profileID]); // see if the email exists already
        if (existingProfile.length === 0) { // if it doesn't exist or is an empty array
            return res.status(400).json({ message: "Profile does not exist, create profile first" });
        }

        const [experiences] = await connection.execute('SELECT * FROM Experiences WHERE profileID = ?', [profileID]);
        const [educations] = await connection.execute('SELECT * FROM Educations WHERE profileID = ?', [profileID]);
        const [certifications] = await connection.execute('SELECT * FROM Certifications WHERE profileID = ?', [profileID]);

        // result
        res.status(200).json({
            status: "Profile retrieved successfully",
            data: {
                profile: existingProfile[0],
                experiences,
                educations,
                certifications
            }   
        });
    } catch(error) {
        console.log(error.message);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    };
};

const editProfile = async (req, res) => {
    try {
        // const { profileID } = req.params;
        const { profileID, fullName, bio, mail, phone, resumeURL, linkedinURL, githubURL, portfolioURL, skills } = req.body;

        // check if profile already exists
        const [existingProfile] = await connection.execute('SELECT * FROM Profiles WHERE profileID = ?', [profileID]); // see if the email exists already
        if (existingProfile.length === 0) { // if it doesn't exist or is an empty array
            return res.status(400).json({ message: "Profile does not exist, create profile first" });
        }

        // update profile in database
        await connection.execute(
            'UPDATE Profiles SET fullName = ?, bio = ?, mail = ?, phone = ?, resumeURL = ?, linkedinURL = ?, githubURL = ?, portfolioURL = ?, skills = ? WHERE profileID = ?',
            [  
                fullName,
                normalize(bio),
                mail,
                phone,  
                normalize(resumeURL),
                normalize(linkedinURL),
                normalize(githubURL), 
                normalize(portfolioURL), 
                normalize(skills)  
            ]
        );

        // result
        res.status(201).json({
            status: "Profile edited successfully",
            data: {
                profileID,
                fullName,
                bio,
                mail,
                phone,
                linkedinURL,
                githubURL,
                portfolioURL,
                skills
            }
        });  
        
    } catch(error) {
        console.log(error.message);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    };
};

const editExperience = async (req, res) => {
    try {
        const { profileID, roleName, companyName, startDate, endDate, city, state, description } = req.body;

        // check if profile already exists
        const [existingProfile] = await connection.execute('SELECT * FROM Profiles WHERE profileID = ?', [profileID]); // see if the email exists already
        if (existingProfile.length === 0) { // if it doesn't exist or is an empty array
            return res.status(400).json({ message: "Profile does not exist, create profile first" });
        }

        // update experience in database
        await connection.execute(
            'UPDATE Experiences SET roleName = ?, companyName = ?, startDate = ?, endDate = ?, city = ?, state = ?, description = ? WHERE profileID = ?',
            [   roleName,
                companyName,
                startDate,
                normalize(endDate), 
                normalize(city),
                normalize(state),
                normalize(description),
                profileID
            ]
        );

        // result
        res.status(201).json({
            status: "Experience edited successfully",
            data: { 
                roleName,
                companyName,
                startDate,
                endDate,
                city,   
                state,
                description
            }
        });

    } catch(error) {
        console.log(error.message);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    };
};

const editEducation = async (req, res) => {
    try {
        const { profileID, schoolName, degree, fieldOfStudy, startDate, endDate, gpa, description } = req.body;

        // check if profile exists for the ID
        const [existingProfile] = await connection.execute('SELECT * FROM Profiles WHERE profileID = ?', [profileID]); // see if the email exists already
        if (existingProfile.length === 0) { // if it doesn't exist or is an empty array
            return res.status(400).json({ message: "Profile does not exist, create profile first" });
        }

        // insert education into database
        await connection.execute(
            'UPDATE Educations SET schoolName = ?, degree = ?, fieldOfStudy = ?, startDate = ?, endDate = ?, gpa = ?, description = ? WHERE profileID = ?',
            [
                profileID,
                schoolName,
                degree,
                fieldOfStudy,
                startDate,
                normalize(endDate), // null can be passed as endDate for present
                normalize(gpa),
                normalize(description)
            ]
        );

        // result
        res.status(200).json({
            status: "Experience edited successfully",
            data: {
                profileID,
                schoolName,
                degree,
                fieldOfStudy,
                startDate,
                endDate,
                gpa,
                description
            }
        });
    } catch(error) {
        console.log(error.message);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    };
};

const editCertification = async (req, res) => {
    try {
        const { profileID, certificationName, organization, startDate, endDate, credentialID, credentialURL } = req.body;

        // check if profile exists for the ID
        const [existingProfile] = await connection.execute('SELECT * FROM Profiles WHERE profileID = ?', [profileID]); // see if the email exists already
        if (existingProfile.length === 0) { // if it doesn't exist or is an empty array
            return res.status(400).json({ message: "Profile does not exist, create profile first" });
        }

        // insert certification into database
        await connection.execute(
            'UPDATE Certifications SET certificationName = ?, organization = ?, startDate = ?, endDate = ?, credentialID = ?, credentialURL = ? WHERE profileID = ?',
            [
                certificationName,
                organization,
                startDate,
                normalize(endDate), // null can be passed as endDate for present
                credentialID,
                credentialURL
            ]
        ); 
        
        // result
        res.status(200).json({
            status: "Certification edited successfully",
            data: {
                certificationName,
                organization,
                startDate,
                endDate,
                credentialID,
                credentialURL
            }
        });
    
    } catch(error) {
        console.log(error.message);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    };
};

const deleteProfile = async (req, res) => {
    try {
        const { profileID } = req.body;

        // check if profile already exists
        const [existingProfile] = await connection.execute('SELECT * FROM Profiles WHERE profileID = ?', [profileID]); // see if the email exists already
        if (existingProfile.length === 0) { // if it doesn't exist or is an empty array
            return res.status(400).json({ message: "Profile does not exist, create profile first" });
        }

        // delete profile from database
        await connection.execute('DELETE FROM Profiles WHERE profileID = ?', [profileID]);

        // result
        res.status(200).json({
            status: "Profile deleted successfully",
            data: {
                profileID
            }
        });

    } catch(error) {
        console.log(error.message);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    };
};

const deleteExperience = async (req, res) => {
    try {
        const { profileID } = req.body;

        // check if profile already exists
        const [existingProfile] = await connection.execute('SELECT * FROM Profiles WHERE profileID = ?', [profileID]); // see if the email exists already
        if (existingProfile.length === 0) { // if it doesn't exist or is an empty array
            return res.status(400).json({ message: "Profile does not exist, create profile first" });
        }

        // delete profile from database
        await connection.execute('DELETE FROM Experiences WHERE profileID = ?', [profileID]);

        // result
        res.status(200).json({
            status: "Experience deleted successfully",
            data: {
                profileID
            }
        });

    } catch(error) {
        console.log(error.message);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    };
};

const deleteEducation = async (req, res) => {
    try {
        const { profileID } = req.body;

        // check if profile already exists
        const [existingProfile] = await connection.execute('SELECT * FROM Profiles WHERE profileID = ?', [profileID]); // see if the email exists already
        if (existingProfile.length === 0) { // if it doesn't exist or is an empty array
            return res.status(400).json({ message: "Profile does not exist, create profile first" });
        }

        // delete education from database
        await connection.execute('DELETE FROM Educations WHERE profileID = ?', [profileID]);

        // result
        res.status(200).json({
            status: "Education deleted successfully",
            data: {
                profileID
            }
        });

    } catch(error) {
        console.log(error.message);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    };
};

const deleteCertification = async (req, res) => {
    try {
        const { profileID } = req.body;

        // check if profile already exists
        const [existingProfile] = await connection.execute('SELECT * FROM Profiles WHERE profileID = ?', [profileID]); // see if the email exists already
        if (existingProfile.length === 0) { // if it doesn't exist or is an empty array
            return res.status(400).json({ message: "Profile does not exist, create profile first" });
        }

        // delete certification from database
        await connection.execute('DELETE FROM Certifications WHERE profileID = ?', [profileID]);

        // result
        res.status(200).json({
            status: "Certification deleted successfully",
            data: {
                profileID
            }
        });

    } catch(error) {
        console.log(error.message);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    };
};

export {
    createProfile,
    addExperience,
    addEducation,
    addCertification,
    getFullProfile,
    editProfile,
    editExperience,
    editEducation,
    editCertification,
    deleteProfile,
    deleteExperience,
    deleteEducation,
    deleteCertification
};


// create Profile, addExeperience, addEducation, addCertification, getProfile, updateProfile, deleteProfile, deleteExperience, deleteEducation, deleteCertification
// calculate duration of experience and education based on start and end date
// get all profiles with pagination and search by name or skill
// get profile by ID
// update profile, experience, education, certification
// delete profile, experience, education, certification
