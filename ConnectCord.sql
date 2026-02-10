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
  profileID VARCHAR(100) NOT NULL PRIMARY KEY,
  bio TEXT, 
  linkedinURL VARCHAR(100),
  githubURL VARCHAR(100),
  portfolioURL VARCHAR(100),
  gpa FLOAT,
  resumePDF VARCHAR(100), #link to the image
  skills text,
  experiences text,
  imageURL VARCHAR(100),
  major VARCHAR(200) NOT NULL, 
  certifications text,
  status VARCHAR(200) NOT NULL, 
  FOREIGN KEY (profileID)
  REFERENCES Users (userID)
);

CREATE TABLE Events(
     eventID VARCHAR(100) NOT NULL PRIMARY KEY,
     eventName VARCHAR(30) NOT NULL,
     eventType VARCHAR(30),
     location VARCHAR(100),
     eventDesc text,
     eventHosts text,
     eventStartTime datetime,
     eventEndTime datetime
	);

CREATE TABLE Attends(
     userID VARCHAR(100) NOT NULL,
     eventID VARCHAR(100) NOT NULL,
     checkInTime datetime,
     checkOutTime datetime,
     FOREIGN KEY (userID)
     REFERENCES Users (userID),
     FOREIGN KEY (eventID)
     REFERENCES Events (eventID),
     PRIMARY KEY (userID, eventID)
	);
    
CREATE TABLE Education(
	profileID VARCHAR(100),
	hsLevel ENUM('Graduate', 'Dropout','Did Not Attend') NOT NULL,
    hsGradYear year,
    uniLevel ENUM('Associates', 'Bachelors', 'Masters', 'Doctorate', 'Dropout', 'Did Not Attend') NOT NULL,
    uniGradYear year,
    uniName VARCHAR(100),
    FOREIGN KEY (profileID)
	REFERENCES Users (userID)
);


