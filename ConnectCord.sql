CREATE SCHEMA IF NOT EXISTS ConnectCord;

USE ConnectCord;

SHOW DATABASES;

CREATE TABLE Users (
	userID VARCHAR(100),
    firstName VARCHAR(255) NOT NULL,
    middleName VARCHAR(255), # optional
    lastName VARCHAR(255) NOT NULL,
    email VARCHAR(40) NOT NULL UNIQUE,
    passwords VARCHAR(50) NOT NULL,
    phoneNumber VARCHAR(10) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    createdAt datetime,
    PRIMARY KEY(userID)
);

CREATE TABLE Profile (
  profileID VARCHAR(100) NOT NULL PRIMARY KEY, #having not null on a primary key is redundant but is still good practice, as it improves clarity
  bio TEXT NOT NULL, 
  linkedinURL VARCHAR(100),
  githubURL VARCHAR(100),
  portfolioURL VARCHAR(100),
  gpa FLOAT,
  resumePDF VARCHAR(100), #link to the image
  skills text,
  experiences text,
  imageURL VARCHAR(100),
  major VARCHAR(200) NOT NULL, 
  status VARCHAR(200) NOT NULL, 
  FOREIGN KEY (profileID)
  REFERENCES Users (userID)
);

CREATE TABLE Events(
     eventID VARCHAR(100) NOT NULL PRIMARY KEY,
     eventName VARCHAR(30) NOT NULL,
     eventType VARCHAR(30) NOT NULL,
     onlineEvent bool NOT NULL,
     eventLocation VARCHAR(100) NOT NULL,
     eventAddress VARCHAR(100) NOT NULL, #used for either the name and address of the event location, or the link should it be online
     eventCity VARCHAR(100) NOT NULL,
     eventState VARCHAR(100) NOT NULL,
     eventDescription text NOT NULL,
	 companyImageURL VARCHAR(100),
     eventStartTime datetime,
     eventEndTime datetime
	);

CREATE TABLE Attends( # marks attendance for events, this can be used to create a list of people that actually attended an event
     userID VARCHAR(100) NOT NULL,
     eventID VARCHAR(100) NOT NULL,
     checkInTime datetime NOT NULL, 
     checkOutTime datetime NOT NULL,
     FOREIGN KEY (userID)
     REFERENCES Users (userID),
     FOREIGN KEY (eventID)
     REFERENCES Events (eventID),
     PRIMARY KEY (userID, eventID)
	);

CREATE TABLE EventHosts( #marks host/admin users for a given event
     userID VARCHAR(100) NOT NULL,
     eventID VARCHAR(100) NOT NULL,
     FOREIGN KEY (userID)
     REFERENCES Users (userID),
     FOREIGN KEY (eventID)
     REFERENCES Events (eventID),
     PRIMARY KEY (userID, eventID)
	);
    
CREATE TABLE EventSignup( #can search using this to find a list of people signed up for an event, though not necessarily attending
	 userID VARCHAR(100) NOT NULL,
     eventID VARCHAR(100) NOT NULL,
	 FOREIGN KEY (userID)
     REFERENCES Users (userID),
     FOREIGN KEY (eventID)
     REFERENCES Events (eventID),
     PRIMARY KEY (userID, eventID)
);
    
CREATE TABLE CollegeEducation(
	profileID VARCHAR(100) NOT NULL,
    uniLevel ENUM('Associates', 'Bachelors', 'Masters', 'Doctorate', 'Dropout', 'Did Not Attend', 'Attending') NOT NULL,
    uniGradYear year NOT NULL,
    uniName VARCHAR(100)NOT NULL,
    major VARCHAR(100) NOT NULL,
    minor VARCHAR(100),
    GPA float,
    FOREIGN KEY (profileID)
	REFERENCES Users (userID),
    PRIMARY KEY (profileID, uniLevel, uniGradYear, uniName, major)
);

CREATE TABLE HighSchoolEducation(
	profileID VARCHAR(100) NOT NULL PRIMARY KEY,
	hsLevel ENUM('Graduate', 'Dropout','Did Not Attend') NOT NULL,
    hsGradYear year,
    GPA float,
    FOREIGN KEY (profileID)
	REFERENCES Users (userID)
);

CREATE TABLE userTags(
    profileID VARCHAR(100) NOT NULL PRIMARY KEY,
    userTag VARCHAR(20),
    FOREIGN KEY (profileID)
	REFERENCES Users (userID)
);

CREATE TABLE Certifications(
	userID VARCHAR(100) NOT NULL,
    certName VARCHAR(200) NOT NULL,
    certProvider VARCHAR(200) NOT NULL,
    certDate date,
	FOREIGN KEY (userID)
	REFERENCES Users (userID),
    PRIMARY KEY (userID, certName)
);
# SELECT userID FROM Attends WHERE eventID = 'insertidhere'; gives you a list of attendees for a certain event, you can change this
# depending on what you need to grab information. we can check in javascript if someone has permissions before giving them any information
