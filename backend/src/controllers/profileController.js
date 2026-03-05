import db from "../config/db.js";

const normalize = (input) => {
    if (input === null || input === undefined) {
        return null;
    } else {
        return input.trim();
    }
};

const getUserProfile = async (req, res) => {
    try {
        const {userID} = req.params;

        // check if user exists for the ID
        const [userRows] = await connection.execute(
                        "SELECT * FROM Users WHERE userID = ?",
                        [userID]
                    );
        if (userRows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        // get user info for th eprofile
        const [results] = await connection.execute(" INSERT INTO Profiles (email, firstName, lastName, mail, phone, city, profileState) SELECT email, firstName, lastName, email, phoneNumber, city, userState FROM Users WHERE userID = ?", [userID]);
    
        res.status(200).json({
            status: "Profile retrieved successfully"
        });

    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const createProfile = async (req, res) => {
    try {
        const { profileID, bio, resumeURL, linkedinURL, githubURL, portfolioURL, skills } = req.body;

        // check if user exists for the ID
        const [userRows] = await connection.execute(
                        "SELECT * FROM Users WHERE userID = ?"
                       
                    );
        if (userRows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        // insert profile into database
        db.prepare(
            'INSERT INTO Profiles (profileID, bio, resumeURL, linkedinURL, githubURL, portfolioURL, skills) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
        ).run(
            profileID,
            normalize(bio),
            normalize(resumeURL),
            normalize(linkedinURL),
            normalize(githubURL),
            normalize(portfolioURL),
            normalize(skills)
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

        

    } catch (error) {};
};

