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