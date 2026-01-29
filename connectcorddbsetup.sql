CREATE DATABASE IF NOT EXISTS connectCordsDB;

USE connectCordsDB;

CREATE TABLE eventInfo
	(
     eventID VARCHAR(10) NOT NULL PRIMARY KEY,
     eventName VARCHAR(30),
     eventType VARCHAR(30),
     location VARCHAR(40),
     eventDate date,
     eventStartTime time,
     eventEndTime time
	);


CREATE TABLE ESP32_DEVICE 
   (	
    deviceID VARCHAR(10) NOT NULL PRIMARY KEY, 
	eventID VARCHAR(10),
    FOREIGN KEY (eventID)
	REFERENCES eventInfo (eventID)
	);
     
CREATE TABLE userInfo
	(
     userID VARCHAR(10) NOT NULL PRIMARY KEY,
     userName VARCHAR(30),
     userEmail VARCHAR(30),
     userPassword VARCHAR(20),
     userRole VARCHAR(20),
     userLocation VARCHAR(50),
	);
     
     
CREATE TABLE userProfile
	(
	 userID VARCHAR(10) NOT NULL PRIMARY KEY,
     major VARCHAR(20),
     skills VARCHAR(300),
     interests VARCHAR(300),
     careerGoals VARCHAR(300),
     userResume VARCHAR(100),
     FOREIGN KEY (userID)
     REFERENCES userInfo (userID)
	);
    
CREATE TABLE attendance
	(
     userID VARCHAR(10) NOT NULL,
     eventID VARCHAR(10) NOT NULL,
     checkInTime time,
     checkOutTime time,
     FOREIGN KEY (userID)
     REFERENCES userInfo (userID),
     FOREIGN KEY (eventID)
     REFERENCES eventInfo (eventID),
     PRIMARY KEY (userID, eventID)
	);

