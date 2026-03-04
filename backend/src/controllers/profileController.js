/*
CREATE TABLE Profiles (
  profileID VARCHAR(100), -- connected to userid
  fullName TEXT NOT NULL,
  bio TEXT NOT NULL,
  mail TEXT,
  phone VARCHAR(50),
  resumeURL VARCHAR(500),
  linkedinURL VARCHAR(200),
  githubURL VARCHAR(200),
  portfolioURL VARCHAR(200),
  skills TEXT,
  FOREIGN KEY (profileID)
  REFERENCES Users (userID)
);

CREATE TABLE Experiences (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  profileID VARCHAR(100) NOT NULL,
  roleName VARCHAR(200) NOT NULL,
  companyName VARCHAR(200) NOT NULL,
  startDate DATE NOT NULL,
  endDate DATE,
  city VARCHAR(500),
  state VARCHAR(500),
  description TEXT,
  FOREIGN KEY (profileID)
  REFERENCES Profiles (profileID)
);

CREATE TABLE Educations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  profileID VARCHAR(100) NOT NULL,
  schoolName VARCHAR(500) NOT NULL,
  degree VARCHAR(500) NOT NULL,
  fieldOfStudy VARCHAR(500) NOT NULL,
  startDate DATE NOT NULL,
  endDate DATE,
  gpa FLOAT,
  description TEXT,
  FOREIGN KEY (profileID)
  REFERENCES Profiles (profileID)
);

CREATE TABLE Certifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  profileID VARCHAR(100) NOT NULL,
  certificationName VARCHAR(500) NOT NULL,
  organization VARCHAR(500) NOT NULL,
  startDate DATE NOT NULL,
  endDate DATE,
  credentialID VARCHAR(500) NOT NULL,
  credentialURL VARCHAR(500) NOT NULL,
  FOREIGN KEY (profileID)
  REFERENCES Profiles (profileID)
);
*/

import db from "../config/db.js";

const normalize = (input) => {
    if (input === null || input === undefined) {
        return null;
    } else {
        return input.trim();
    }
};

const createProfile = async (req, res) => {
    try {
        const { profileID, fullName, bio, mail, phone, resumeURL, linkedinURL, githubURL, portfolioURL, skills } = req.body;

        // check if user exists for the ID
        const existingUser = db.prepare('SELECT * FROM Users WHERE userID = ?').get(profileID);
        if (!existingUser) {
            return res.status(400).json({ message: "User does not exist" });
        }

        // insert profile into database
        db.prepare(
            'INSERT INTO Profiles (profileID, fullName, bio, mail, phone, resumeURL, linkedinURL, githubURL, portfolioURL, skills) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
        ).run(
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
        );

        res.status(201).json({
            status: "Profile created successfully",
            data: { profileID, fullName, bio, mail, phone, linkedinURL, githubURL, portfolioURL, skills }
        });

    } catch(error) {
        console.log(error.message);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

const addExperience = async (req, res) => {
    try {
        const { profileID, roleName, companyName, startDate, endDate, city, state, description } = req.body;

        // check if profile exists
        const existingProfile = db.prepare('SELECT * FROM Profiles WHERE profileID = ?').get(profileID);
        if (!existingProfile) {
            return res.status(400).json({ message: "Profile does not exist, create profile first" });
        }

        db.prepare(
            'INSERT INTO Experiences (profileID, roleName, companyName, startDate, endDate, city, state, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
        ).run(
            profileID,
            roleName,
            companyName,
            startDate,
            normalize(endDate),
            normalize(city),
            normalize(state),
            normalize(description)
        );

        res.status(200).json({
            status: "Experience added successfully",
            data: { roleName, companyName, startDate, endDate, city, state, description }
        });

    } catch(error) {
        console.log(error.message);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

const addEducation = async (req, res) => {
    try {
        const { profileID, schoolName, degree, fieldOfStudy, startDate, endDate, gpa, description } = req.body;

        const existingProfile = db.prepare('SELECT * FROM Profiles WHERE profileID = ?').get(profileID);
        if (!existingProfile) {
            return res.status(400).json({ message: "Profile does not exist, create profile first" });
        }

        db.prepare(
            'INSERT INTO Educations (profileID, schoolName, degree, fieldOfStudy, startDate, endDate, gpa, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
        ).run(
            profileID,
            schoolName,
            degree,
            fieldOfStudy,
            startDate,
            normalize(endDate),
            normalize(gpa),
            normalize(description)
        );

        res.status(200).json({
            status: "Education added successfully",
            data: { profileID, schoolName, degree, fieldOfStudy, startDate, endDate, gpa, description }
        });

    } catch(error) {
        console.log(error.message);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

const addCertification = async (req, res) => {
    try {
        const { profileID, certificationName, organization, startDate, endDate, credentialID, credentialURL } = req.body;

        const existingProfile = db.prepare('SELECT * FROM Profiles WHERE profileID = ?').get(profileID);
        if (!existingProfile) {
            return res.status(400).json({ message: "Profile does not exist, create profile first" });
        }

        db.prepare(
            'INSERT INTO Certifications (profileID, certificationName, organization, startDate, endDate, credentialID, credentialURL) VALUES (?, ?, ?, ?, ?, ?, ?)'
        ).run(
            profileID,
            certificationName,
            organization,
            startDate,
            normalize(endDate),
            credentialID,
            credentialURL
        );

        res.status(200).json({
            status: "Certification added successfully",
            data: { certificationName, organization, startDate, endDate, credentialID, credentialURL }
        });

    } catch(error) {
        console.log(error.message);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

const getFullProfile = async (req, res) => {
    try {
        const { profileID } = req.params;

        const existingProfile = db.prepare('SELECT * FROM Profiles WHERE profileID = ?').get(profileID);
        if (!existingProfile) {
            return res.status(400).json({ message: "Profile does not exist, create profile first" });
        }

        const experiences    = db.prepare('SELECT * FROM Experiences WHERE profileID = ?').all(profileID);
        const educations     = db.prepare('SELECT * FROM Educations WHERE profileID = ?').all(profileID);
        const certifications = db.prepare('SELECT * FROM Certifications WHERE profileID = ?').all(profileID);

        res.status(200).json({
            status: "Profile retrieved successfully",
            data: { profile: existingProfile, experiences, educations, certifications }
        });

    } catch(error) {
        console.log(error.message);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

const editProfile = async (req, res) => {
    try {
        const { profileID, fullName, bio, mail, phone, resumeURL, linkedinURL, githubURL, portfolioURL, skills } = req.body;

        const existingProfile = db.prepare('SELECT * FROM Profiles WHERE profileID = ?').get(profileID);
        if (!existingProfile) {
            return res.status(400).json({ message: "Profile does not exist, create profile first" });
        }

        db.prepare(
            'UPDATE Profiles SET fullName = ?, bio = ?, mail = ?, phone = ?, resumeURL = ?, linkedinURL = ?, githubURL = ?, portfolioURL = ?, skills = ? WHERE profileID = ?'
        ).run(
            fullName,
            normalize(bio),
            mail,
            phone,
            normalize(resumeURL),
            normalize(linkedinURL),
            normalize(githubURL),
            normalize(portfolioURL),
            normalize(skills),
            profileID
        );

        res.status(201).json({
            status: "Profile edited successfully",
            data: { profileID, fullName, bio, mail, phone, linkedinURL, githubURL, portfolioURL, skills }
        });

    } catch(error) {
        console.log(error.message);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

const editExperience = async (req, res) => {
    try {
        const { profileID, roleName, companyName, startDate, endDate, city, state, description } = req.body;

        const existingProfile = db.prepare('SELECT * FROM Profiles WHERE profileID = ?').get(profileID);
        if (!existingProfile) {
            return res.status(400).json({ message: "Profile does not exist, create profile first" });
        }

        db.prepare(
            'UPDATE Experiences SET roleName = ?, companyName = ?, startDate = ?, endDate = ?, city = ?, state = ?, description = ? WHERE profileID = ?'
        ).run(
            roleName,
            companyName,
            startDate,
            normalize(endDate),
            normalize(city),
            normalize(state),
            normalize(description),
            profileID
        );

        res.status(201).json({
            status: "Experience edited successfully",
            data: { roleName, companyName, startDate, endDate, city, state, description }
        });

    } catch(error) {
        console.log(error.message);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

const editEducation = async (req, res) => {
    try {
        const { profileID, schoolName, degree, fieldOfStudy, startDate, endDate, gpa, description } = req.body;

        const existingProfile = db.prepare('SELECT * FROM Profiles WHERE profileID = ?').get(profileID);
        if (!existingProfile) {
            return res.status(400).json({ message: "Profile does not exist, create profile first" });
        }

        db.prepare(
            'UPDATE Educations SET schoolName = ?, degree = ?, fieldOfStudy = ?, startDate = ?, endDate = ?, gpa = ?, description = ? WHERE profileID = ?'
        ).run(
            schoolName,
            degree,
            fieldOfStudy,
            startDate,
            normalize(endDate),
            normalize(gpa),
            normalize(description),
            profileID
        );

        res.status(200).json({
            status: "Education edited successfully",
            data: { profileID, schoolName, degree, fieldOfStudy, startDate, endDate, gpa, description }
        });

    } catch(error) {
        console.log(error.message);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

const editCertification = async (req, res) => {
    try {
        const { profileID, certificationName, organization, startDate, endDate, credentialID, credentialURL } = req.body;

        const existingProfile = db.prepare('SELECT * FROM Profiles WHERE profileID = ?').get(profileID);
        if (!existingProfile) {
            return res.status(400).json({ message: "Profile does not exist, create profile first" });
        }

        db.prepare(
            'UPDATE Certifications SET certificationName = ?, organization = ?, startDate = ?, endDate = ?, credentialID = ?, credentialURL = ? WHERE profileID = ?'
        ).run(
            certificationName,
            organization,
            startDate,
            normalize(endDate),
            credentialID,
            credentialURL,
            profileID
        );

        res.status(200).json({
            status: "Certification edited successfully",
            data: { certificationName, organization, startDate, endDate, credentialID, credentialURL }
        });

    } catch(error) {
        console.log(error.message);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

const deleteProfile = async (req, res) => {
    try {
        const { profileID } = req.body;

        const existingProfile = db.prepare('SELECT * FROM Profiles WHERE profileID = ?').get(profileID);
        if (!existingProfile) {
            return res.status(400).json({ message: "Profile does not exist, create profile first" });
        }

        db.prepare('DELETE FROM Profiles WHERE profileID = ?').run(profileID);

        res.status(200).json({ status: "Profile deleted successfully", data: { profileID } });

    } catch(error) {
        console.log(error.message);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

const deleteExperience = async (req, res) => {
    try {
        const { profileID } = req.body;

        const existingProfile = db.prepare('SELECT * FROM Profiles WHERE profileID = ?').get(profileID);
        if (!existingProfile) {
            return res.status(400).json({ message: "Profile does not exist, create profile first" });
        }

        db.prepare('DELETE FROM Experiences WHERE profileID = ?').run(profileID);

        res.status(200).json({ status: "Experience deleted successfully", data: { profileID } });

    } catch(error) {
        console.log(error.message);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

const deleteEducation = async (req, res) => {
    try {
        const { profileID } = req.body;

        const existingProfile = db.prepare('SELECT * FROM Profiles WHERE profileID = ?').get(profileID);
        if (!existingProfile) {
            return res.status(400).json({ message: "Profile does not exist, create profile first" });
        }

        db.prepare('DELETE FROM Educations WHERE profileID = ?').run(profileID);

        res.status(200).json({ status: "Education deleted successfully", data: { profileID } });

    } catch(error) {
        console.log(error.message);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

const deleteCertification = async (req, res) => {
    try {
        const { profileID } = req.body;

        const existingProfile = db.prepare('SELECT * FROM Profiles WHERE profileID = ?').get(profileID);
        if (!existingProfile) {
            return res.status(400).json({ message: "Profile does not exist, create profile first" });
        }

        db.prepare('DELETE FROM Certifications WHERE profileID = ?').run(profileID);

        res.status(200).json({ status: "Certification deleted successfully", data: { profileID } });

    } catch(error) {
        console.log(error.message);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
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