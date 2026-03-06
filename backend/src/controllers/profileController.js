import connection from "../config/db.js";

const normalize = (input) => {
    if (input === null || input === undefined) {
        return null;
    } else {
        return input.trim();
    }
};

const automateUserInfo = async (req, res) => {
    try {
        const { email } = req.body;

        // check if user exists
        const [userRows] = await connection.execute(
            "SELECT * FROM Users WHERE email = ?",
            [email]
        );
        if (userRows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        // populate profile with user info from sign up
        await connection.execute(
            `INSERT INTO Profiles (profileID, firstName, lastName, mail, phone, city, profileState) 
             SELECT userID, firstName, lastName, email, phoneNumber, city, userState 
             FROM Users WHERE email = ?`,
            [email]
        );

        res.status(201).json({
            status: "Profile populated successfully"
        });

    } catch (error) {
        console.error("Error populating user profile:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const createProfile = async (req, res) => {
    try {
        const { profileID, bio, resumeURL, linkedinURL, githubURL, portfolioURL, skills } = req.body;

        // check if user exists for the ID
        const [userRows] = await connection.execute(
                        "SELECT * FROM Users WHERE userID = ?", [profileID]
                       
                    );
        if (userRows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        // insert profile into database
        await connection.execute(
            'INSERT INTO Profiles (profileID, bio, resumeURL, linkedinURL, githubURL, portfolioURL, skills) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [
                profileID,
                normalize(bio),
                normalize(resumeURL),
                normalize(linkedinURL),
                normalize(githubURL),
                normalize(portfolioURL),
                normalize(skills)
            ]
        );

        res.status(201).json({
            status: "Profile created successfully",
            data: { profileID, bio, linkedinURL, githubURL, portfolioURL, skills }
        });

    } catch(error) {
        console.log(error.message);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

const editProfile = async (req, res) => {
    try {
        const { profileID, firstName, lastName, bio, mail, phone, city, profileState, resumeURL, linkedinURL, githubURL, portfolioURL, skills } = req.body;
    
        // check if profile exists for the ID
        const [profileRows] = await connection.execute(
                        "SELECT * FROM Profiles WHERE profileID = ?",
                        [profileID]
        );  
        if (profileRows.length === 0) {
            return res.status(404).json({ message: "Create Profile to edit it." });
        }

        // update profile in database, they don't need to change everything
        await connection.execute(
            'UPDATE Profiles SET firstName = ?, lastName = ?, bio = ?, mail = ?, phone = ?, city = ?, profileState = ?, resumeURL = ?, linkedinURL = ?, githubURL = ?, portfolioURL = ?, skills = ? WHERE profileID = ?',
            [
                normalize(firstName),
                normalize(lastName),
                normalize(bio),
                normalize(mail),
                normalize(phone),
                normalize(city),
                normalize(profileState),
                normalize(resumeURL),
                normalize(linkedinURL),
                normalize(githubURL),
                normalize(portfolioURL),
                normalize(skills),
                profileID
            ]
        );

        // result
        res.status(201).json({
            status: "Profile edited successfully",
            data: { profileID, firstName, lastName, bio, mail, phone, city, profileState, resumeURL, linkedinURL, githubURL, portfolioURL, skills }
        });


    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    };
};

const deleteProfile = async (req, res) => {
    try {
        const { profileID } = req.body;

        // check if profile exists for the ID
        const [profileRows] = await connection.execute(
                        "SELECT * FROM Profiles WHERE profileID = ?",
                        [profileID]
        );

        if (profileRows.length === 0) {
            return res.status(404).json({ message: "Profile not found" });
        }

        // delete profile from database
        await connection.execute(
            'DELETE FROM Profiles WHERE profileID = ?',
            [profileID]
        );

        res.status(200).json({
            status: "Profile deleted successfully"
        });

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    };
};

const addExperience = async (req, res) => {
    try {
        const { id, profileID, roleName, companyName, roleType, startDate, endDate, city, roleState, description } = req.body;
        
        // check if profile exists for the ID
        const [profileRows] = await connection.execute(
                        "SELECT * FROM Profiles WHERE profileID = ?",
                        [profileID]
        );

        if (profileRows.length === 0) {
            return res.status(404).json({ message: "Profile not found" });
        }


        // the id should be incremented by 1 for each experience added, so we need to get the last id and add 1 to it
        const [experienceRows] = await connection.execute(
                        "SELECT * FROM Experiences WHERE profileID = ? ORDER BY id DESC LIMIT 1",
                        [profileID]
        ); // if there are no experiences, the id should be 1
        let newId = 1;
        if (experienceRows.length > 0) {
            newId = experienceRows[0].id + 1;
        }

        // insert experience into database
        await connection.execute(
            'INSERT INTO Experiences (id, profileID, roleName, companyName, roleType, startDate, endDate, city, roleState, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
                newId,
                profileID,
                normalize(roleName),
                normalize(companyName),
                normalize(roleType),
                normalize(startDate),
                normalize(endDate),
                normalize(city),
                normalize(roleState),
                normalize(description)
            ]
        );

        res.status(201).json({
            status: "Experience added successfully",
            data: { id: newId, profileID, roleName, companyName, roleType, startDate, endDate, city, roleState, description }
        });
        

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    };
};

const editExperience = async (req, res) => {
    try {
        const { id, profileID, roleName, companyName, roleType, startDate, endDate, city, roleState, description } = req.body;
        
        // check if profile exists for the ID
        const [profileRows] = await connection.execute(
                        "SELECT * FROM Profiles WHERE profileID = ?",
                        [profileID]
        );

        if (profileRows.length === 0) {
            return res.status(404).json({ message: "Profile not found" });
        }
        // check if experience exists for the ID
        const [experienceRows] = await connection.execute(
                        "SELECT * FROM Experiences WHERE id = ? AND profileID = ?",
                        [id, profileID]
        );

        if (experienceRows.length === 0) {
            return res.status(404).json({ message: "Experience not found" });
        }

        // update experience in database, they don't need to change everything
        await connection.execute(
            'UPDATE Experiences SET roleName = ?, companyName = ?, roleType = ?, startDate = ?, endDate = ?, city = ?, roleState = ?, description = ? WHERE id = ? AND profileID = ?',
            [
                normalize(roleName),
                normalize(companyName),
                normalize(roleType),
                normalize(startDate),
                normalize(endDate),
                normalize(city),
                normalize(roleState),
                normalize(description),
                id,
                profileID
            ]
        );

        res.status(200).json({
            status: "Experience edited successfully",
            data: { id, profileID, roleName, companyName, roleType, startDate, endDate, city, roleState, description }
        });

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    };
};

const deleteExperience = async (req, res) => {
    try {
        const { id, profileID } = req.body;

        // check if profile exists for the ID
        const [profileRows] = await connection.execute(
                        "SELECT * FROM Experiences WHERE id = ? AND profileID = ?",
                        [id, profileID]
        );

        if (profileRows.length === 0) {
            return res.status(404).json({ message: "Profile not found" });
        }

        // delete profile from database
        await connection.execute(
            'DELETE FROM Experiences WHERE id = ? AND profileID = ?',
            [id, profileID]
        );

        // decrement the id of the experiences that come after the deleted experience
        await connection.execute(
            'UPDATE Experiences SET id = id - 1 WHERE id > ? AND profileID = ?',
            [id, profileID]
        ); 

        res.status(200).json({
            status: "Experience deleted successfully"
        });

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    };
};

const getAllExperiences = async (req, res) => {
    try {
        const { profileID } = req.body;

        // check if profile exists for the ID
        const [profileRows] = await connection.execute(
                        "SELECT * FROM Profiles WHERE profileID = ?",
                        [profileID]
        );

        if (profileRows.length === 0) {
            return res.status(404).json({ message: "Profile not found" });
        }

        // get experiences from database
        const [experienceRows] = await connection.execute(
            'SELECT * FROM Experiences WHERE profileID = ?',
            [profileID]
        );

        res.status(200).json({
            status: "Experiences retrieved successfully",
            data: experienceRows
        });

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    };
};

const addEducation = async (req, res) => {
    try {
        const { id, profileID, schoolName, degree, fieldOfStudy, startDate, endDate, city, educationState, description } = req.body;
        
        // check if profile exists for the ID
        const [profileRows] = await connection.execute(
                        "SELECT * FROM Profiles WHERE profileID = ?",
                        [profileID]
        );

        if (profileRows.length === 0) {
            return res.status(404).json({ message: "Profile not found" });
        }
        

        if (educationRows.length === 0) {
            return res.status(404).json({ message: "Education not found" });
        }

        // the id should be incremented by 1 for each experience added, so we need to get the last id and add 1 to it
        const [educationRow] = await connection.execute(
                        "SELECT * FROM Educations WHERE profileID = ? ORDER BY id DESC LIMIT 1",
                        [profileID]
        ); // if there are no experiences, the id should be 1
        let newId = 1;
        if (educationRow.length > 0) {
            newId = educationRow[0].id + 1;
        }

        // insert education into database
        await connection.execute(
            'INSERT INTO Educations (id, profileID, schoolName, degree, fieldOfStudy, startDate, endDate, city, educationState, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
                newId,
                profileID,
                normalize(schoolName),
                normalize(degree),
                normalize(fieldOfStudy),
                normalize(startDate),
                normalize(endDate),
                normalize(city),
                normalize(educationState),
                normalize(description)
            ]
        );

        res.status(201).json({
            status: "Education added successfully",
            data: { id, profileID, schoolName, degree, fieldOfStudy, startDate, endDate, city, educationState, description }
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    };
};

const editEducation = async (req, res) => {
    try {
        const { id, profileID, schoolName, degree, fieldOfStudy, startDate, endDate, city, educationState, description } = req.body;
        
        // check if profile exists for the ID
        const [profileRows] = await connection.execute(
                        "SELECT * FROM Profiles WHERE profileID = ?",
                        [profileID]
        );

        if (profileRows.length === 0) {
            return res.status(404).json({ message: "Profile not found" });
        }
        // check if education exists for the ID
        const [educationRows] = await connection.execute(
                        "SELECT * FROM Educations WHERE id = ? AND profileID = ?",
                        [id, profileID]
        );

        if (educationRows.length === 0) {
            return res.status(404).json({ message: "Education not found" });
        }

        // update education in database, they don't need to change everything
        await connection.execute(
            'UPDATE Educations SET schoolName = ?, degree = ?, fieldOfStudy = ?, startDate = ?, endDate = ?, city = ?, educationState = ?, description = ? WHERE id = ? AND profileID = ?',
            [
                normalize(schoolName),
                normalize(degree),
                normalize(fieldOfStudy),
                normalize(startDate),
                normalize(endDate),
                normalize(city),
                normalize(educationState),
                normalize(description),
                id,
                profileID
            ]
        );

        res.status(201).json({
            status: "Education edited successfully",
            data: { id, profileID, schoolName, degree, fieldOfStudy, startDate, endDate, city, educationState, description }
        });

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    };
};

const deleteEducation = async (req, res) => {
    try {
        const { id, profileID } = req.body;

        // check if profile exists for the ID
        const [profileRows] = await connection.execute(
                        "SELECT * FROM Educations WHERE id = ? AND profileID = ?",
                        [id, profileID]
        );

        if (profileRows.length === 0) {
            return res.status(404).json({ message: "Profile not found" });
        }

        // delete profile from database
        await connection.execute(
            'DELETE FROM Educations WHERE id = ? AND profileID = ?',
            [id, profileID]
        );

        

        // decrement the id of the experiences that come after the deleted experience
        await connection.execute(
            'UPDATE Educations SET id = id - 1 WHERE id > ? AND profileID = ?',
            [id, profileID]
        ); 

        res.status(200).json({
            status: "Education deleted successfully"
        });

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    };
};

const getAllEducation = async (req, res) => {
    try {
        const { profileID } = req.body;

        // check if profile exists for the ID
        const [profileRows] = await connection.execute(
                        "SELECT * FROM Profiles WHERE profileID = ?",
                        [profileID]
        );

        if (profileRows.length === 0) {
            return res.status(404).json({ message: "Profile not found" });
        }

        // get experiences from database
        const [educationRows] = await connection.execute(
            'SELECT * FROM Educations WHERE profileID = ?',
            [profileID]
        );

        res.status(200).json({
            status: "Education retrieved successfully",
            data: educationRows
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    };
};

/* CREATE TABLE Certifications (
  id INT PRIMARY KEY AUTO_INCREMENT,
  profileID VARCHAR(100) NOT NULL,
  certificationName VARCHAR(500) NOT NULL,
  organization VARCHAR(500) NOT NULL,
  startDate DATETIME NOT NULL,
  endDate DATETIME,
  credentialID VARCHAR(500) NOT NULL,
  credentialURL varchar(500) NOT NULL,
  FOREIGN KEY (profileID)
  REFERENCES Profiles (profileID)
);
 */
const addCertification = async (req, res) => {
    try {
        const { id, profileID, certificationName, organization, startDate, endDate, credentialID, credentialURL } = req.body;

        // check if profile exists for the ID
        const [profileRows] = await connection.execute(
                        "SELECT * FROM Profiles WHERE profileID = ?",
                        [profileID]
        );

        if (profileRows.length === 0) {
            return res.status(404).json({ message: "Profile not found" });
        }

        // the id should be incremented by 1 for each experience added, so we need to get the last id and add 1 to it
        const [certificationRows] = await connection.execute(
                        "SELECT * FROM Certifications WHERE profileID = ? ORDER BY id DESC LIMIT 1",
                        [profileID]
        ); // if there are no experiences, the id should be 1
        let newId = 1;
        if (certificationRows.length > 0) {
            newId = certificationRows[0].id + 1;
        }

        // insert certification into database
        await connection.execute(
            'INSERT INTO Certifications (id, profileID, certificationName, organization, startDate, endDate, credentialID, credentialURL) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [
                newId,
                profileID,
                normalize(certificationName),
                normalize(organization),
                normalize(startDate),
                normalize(endDate),
                normalize(credentialID),
                normalize(credentialURL)
            ]
        );

        res.status(201).json({
            status: "Certification added successfully",
            data: { id, profileID, certificationName, organization, startDate, endDate, credentialID, credentialURL }
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    };
};

const editCertification = async (req, res) => {
    try {
        const { id, profileID, certificationName, organization, startDate, endDate, credentialID, credentialURL } = req.body;

        // check if profile exists for the ID
        const [profileRows] = await connection.execute(
                        "SELECT * FROM Profiles WHERE profileID = ?",
                        [profileID]
        );  
        if (profileRows.length === 0) {
            return res.status(404).json({ message: "Profile not found" });
        }
        // check if certification exists for the ID
        const [certificationRows] = await connection.execute(
                        "SELECT * FROM Certifications WHERE id = ? AND profileID = ?",
                        [id, profileID]
        );

        if (certificationRows.length === 0) {
            return res.status(404).json({ message: "Certification not found" });
        }

        // update certification in database, they don't need to change everything
        await connection.execute(
            'UPDATE Certifications SET certificationName = ?, organization = ?, startDate = ?, endDate = ?, credentialID = ?, credentialURL = ? WHERE id = ? AND profileID = ?',
            [
                normalize(certificationName),
                normalize(organization),
                normalize(startDate),
                normalize(endDate),
                normalize(credentialID),
                normalize(credentialURL),
                id,
                profileID
            ]
        );

        res.status(201).json({
            status: "Certification edited successfully",
            data: { id, profileID, certificationName, organization, startDate, endDate, credentialID, credentialURL }
        });

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    };
};

const deleteCertification = async (req, res) => {
    try {

        const { id, profileID } = req.body;

        // check if profile exists for the ID
        const [profileRows] = await connection.execute(
                        "SELECT * FROM Certifications WHERE id = ? AND profileID = ?",
                        [id, profileID]
        );

        if (profileRows.length === 0) {
            return res.status(404).json({ message: "Profile not found" });
        }

        // delete certification from database
        await connection.execute(
            'DELETE FROM Certifications WHERE id = ? AND profileID = ?',
            [id, profileID]
        );

        // decrement the id of the experiences that come after the deleted experience
        await connection.execute(
            'UPDATE Certifications SET id = id - 1 WHERE id > ? AND profileID = ?',
            [id, profileID]
        );

        // result
        res.status(200).json({
            status: "Certification deleted successfully"
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    };
};

const getAllCertifications = async (req, res) => {
    try {
        const { profileID } = req.body;

        // check if profile exists for the ID
        const [profileRows] = await connection.execute(
                        "SELECT * FROM Profiles WHERE profileID = ?",
                        [profileID]
        );

        if (profileRows.length === 0) {
            return res.status(404).json({ message: "Profile not found" });
        }

        // get certifications from database
        const [certificationRows] = await connection.execute(
            'SELECT * FROM Certifications WHERE profileID = ?',
            [profileID]
        );

        res.status(200).json({
            status: "Certifications retrieved successfully",
            data: certificationRows
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    };
};

export { automateUserInfo, createProfile, editProfile, deleteProfile, addExperience, editExperience, deleteExperience, addEducation, editEducation, deleteEducation, addCertification, editCertification, getAllCertifications, deleteCertification, getAllExperiences, getAllEducation };

/* DATABASE FOR THIS:
CREATE TABLE Users (
	userID VARCHAR(100),
    firstName VARCHAR(255) NOT NULL,
    middleName VARCHAR(255), # optional
    lastName VARCHAR(255) NOT NULL,
    email VARCHAR(40) NOT NULL UNIQUE,
    passwords VARCHAR(255) NOT NULL,
    phoneNumber VARCHAR(15) NOT NULL,
    city VARCHAR(100) NOT NULL,
    userState VARCHAR(100) NOT NULL,
    createdAt datetime DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(userID)
);





CREATE TABLE Profiles (
  profileID VARCHAR(100) PRIMARY KEY, -- connected to userid
  firstName VARCHAR(100) NOT NULL,
	lastName VARCHAR(100) NOT NULL,
  bio TEXT NOT NULL,
  mail TEXT,
  phone VARCHAR(50),
	city VARCHAR(100),
	profileState VARCHAR(100),
  resumeURL VARCHAR(500),
  linkedinURL VARCHAR(200),
  githubURL VARCHAR(200),
  portfolioURL VARCHAR(200),
  skills TEXT,
  FOREIGN KEY (profileID)
  REFERENCES Users (userID)
  -- add a location and get info from users table
);

-- one profile can have multiple experience, education, certification

CREATE TABLE Experiences (
  id INT PRIMARY KEY AUTO_INCREMENT,
  profileID VARCHAR(100) NOT NULL,
  roleName VARCHAR(200) NOT NULL,
  companyName VARCHAR(200) NOT NULL,
  roleType VARCHAR(100) NOT NULL, -- full time, part time, etc.
  startDate DATETIME NOT NULL,
  endDate DATETIME, -- this can be marked as null and when it is null it will be taken as present
  city VARCHAR(500),
  roleState VARCHAR(500),
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
  startDate DATETIME NOT NULL,
  endDate DATETIME, -- can be null for present
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
  startDate DATETIME NOT NULL,
  endDate DATETIME,
  credentialID VARCHAR(500) NOT NULL,
  credentialURL varchar(500) NOT NULL,
  FOREIGN KEY (profileID)
  REFERENCES Profiles (profileID)
);

*/ 