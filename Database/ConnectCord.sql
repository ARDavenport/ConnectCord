
CREATE SCHEMA ConnectCord;

USE ConnectCord;

SHOW DATABASES;


CREATE TABLE Users (
	userID VARCHAR(100),
    firstName VARCHAR(255) NOT NULL,
    middleName VARCHAR(255), # optional
    lastName VARCHAR(255) NOT NULL,
    email VARCHAR(40) NOT NULL UNIQUE,
    passwords VARCHAR(255) NOT NULL,
    phoneNumber VARCHAR(10) NOT NULL,
    city VARCHAR(100) NOT NULL,
    userState VARCHAR(100) NOT NULL,
    createdAt datetime,
    PRIMARY KEY(userID)
);



SET @my_uuid = UUID();

INSERT INTO Users (userID, firstName, middleName, lastName, email, passwords, phoneNumber, roles, city, state, createdAt) VALUES
(@my_uuid, 'Emma', NULL, 'Stewart', 'emma@gmail.com', "Emma123*", '1235423468', 'user', 'Nashville', 'Tennessee', NOW()); 


SELECT * FROM Users;

-- local user
CREATE USER 'Oviya'@'localhost' IDENTIFIED BY 'Vomisha';

-- give privilidges in this database to this user
GRANT ALL privileges ON ConnectCord.* TO'Oviya'@'localhost';

FLUSH privileges; 

CREATE TABLE Profiles (
  profileID VARCHAR(100), -- connected to userid
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
  roleType VARCHAR(100) NOT NULL, --full time, part time, etc.
  startDate DATE NOT NULL,
  endDate DATE, -- this can be marked as null and when it is null it will be taken as present
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

CREATE TABLE Events (
  eventID varchar(100),
  eventName varchar(300) NOT NULL,
  organization varchar(300) NOT NULL,
  eventHosts TEXT NOT NULL,
  -- admins TEXT,
  -- volunteers TEXT,
  --attendees
  description TEXT,
  eventFee FLOAT NOT NULL,
  eventStartTime DATETIME NOT NULL,
  eventEndTime DATETIME NOT NULL,
  city varchar(200),
  eventState varchar(200),
  eventAddress varchar(400) NOT NULL, -- can tell if the event is online w a meeting link or just a regular address
  eventPicture varchar(500), -- can be null
  eventCapacity INT, -- can be null

);

CREATE TABLE Attends (  -- marks attendance for events, this can be used to create a list of people that actually attended an event
  userID VARCHAR(100) NOT NULL,
     eventID VARCHAR(100) NOT NULL,
     checkInTime datetime NOT NULL, 
     checkOutTime datetime NOT NULL,
     role ENUM ('Host', 'Admin', 'Volunteer', 'Attendee') NOT NULL, -- not pulled from registration because people who did not register can attend the event
     FOREIGN KEY (userID)
     REFERENCES Users (userID),
     FOREIGN KEY (eventID)
     REFERENCES Events (eventID),
     PRIMARY KEY (userID, eventID)
);

CREATE TABLE Registration (
  registrationID INT PRIMARY KEY AUTO_INCREMENT, -- also keeps track of capacity count
  eventID VARCHAR(100) NOT NULL,
  profileID VARCHAR(100) NOT NULL,
  role ENUM ('Host', 'Admin', 'Volunteer', 'Attendee') NOT NULL,
  registeredAt DateTime NOT NULL, -- prioritize capacity by this
  FOREIGN KEY (profileID)
     REFERENCES Profiles (profileID),
     FOREIGN KEY (eventID)
     REFERENCES Events (eventID)
     
);

CREATE TABLE SavedEvents (
   eventID VARCHAR(100) NOT NULL,
  profileID VARCHAR(100) NOT NULL,
  FOREIGN KEY (profileID)
     REFERENCES Profiles (profileID),
     FOREIGN KEY (eventID)
     REFERENCES Events (eventID),
     PRIMARY KEY (profileID, eventID)
);

/*

model User {
  userID String @id @default(uuid())
  firstName String
  middleName String? // optional
  lastName String
  email String @unique // must be unique
  password String
  phoneNumber String
  role String // user or admin
  city String // let us go with just city and state for now and not a whole address
  state String // we can update it to an enum
  // we can make it internsational as well- it is currently just US
  createdAt DateTime @default(now()) // user since
  
  // relations to Profile
  profiles Profile[]
}

// Profile
model Profile {
  profileID String @id @default(uuid())
  bio String? // optional
  linkedinURL String? // optional
  githubURL String? // optional
  portfolioURL String? // optional
  gpa Float? // optional
  resumePDF String? // link to resume pdf stored in cloud storage
  skills String[] // array of skills
  experiences String[] // enum maybe
  education String[] // might need to make an enum
  imageURL String? // optional, profile picture

  // Relations
  user User @relation(fields: [profileID], references: [userID], onDelete: Cascade)
}

// Resume pdf update and manual entering so different table

*/
