CREATE SCHEMA ConnectCord;

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
    roles VARCHAR(100) NOT NULL, 
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
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