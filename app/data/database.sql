DROP DATABASE IF EXISTS comp2800;
DROP DATABASE IF EXISTS COMP2800;

CREATE DATABASE IF NOT EXISTS comp2800;

USE comp2800;

CREATE TABLE IF NOT EXISTS bby14_users (
  ID int NOT NULL AUTO_INCREMENT,
  first_name varchar(30),
  last_name varchar(30),
  email varchar(30),
  password varchar(30),
  latitude float(20), 
  longitude float(20), 
  age int,
  bio varchar(100),
  is_admin BOOLEAN,
  UNIQUE(email),
  PRIMARY KEY (ID));

CREATE TABLE IF NOT EXISTS Hobbies (
userID INTEGER,
hobby varchar(50),
PRIMARY KEY(userID, hobby),
FOREIGN KEY (userID) REFERENCES bby14_users(ID));

CREATE TABLE IF NOT EXISTS Friends (
user INTEGER,
friend INTEGER,
PRIMARY KEY(user, friend),
FOREIGN KEY (user) REFERENCES bby14_users(ID),
FOREIGN KEY (friend) REFERENCES bby14_users(ID));

CREATE TABLE IF NOT EXISTS UserPhotos (
userID INTEGER,
imageID VARBINARY(1000),
PRIMARY KEY(userID, imageID),
FOREIGN KEY (userID) REFERENCES bby14_users(ID));

CREATE TABLE IF NOT EXISTS Posts (
userID INTEGER,
postNum INTEGER NOT NULL auto_increment,
posts LONGTEXT,
postDate varchar(30),
postTime varchar(30),
PRIMARY KEY(userID),
KEY (postNum),
FOREIGN KEY(userID) REFERENCES bby14_users(ID)
);




INSERT INTO bby14_users (first_name, last_name, email, password, latitude, longitude, age, bio, is_admin) VALUES (
    "Alpha", "Admin", "alpha@my.bcit.ca", "admin", 50, -123, 50, "Alpha bio.", true);

INSERT INTO bby14_users (first_name, last_name, email, password, latitude, longitude, age, bio, is_admin) VALUES (
    "Bravo", "User", "bravo@my.bcit.ca", "user", 50, -122, 50, "Bravo bio.", false);

INSERT INTO bby14_users (first_name, last_name, email, password, latitude, longitude, age, bio, is_admin) VALUES (
    "Charlie", "Admin", "charlie@my.bcit.ca", "admin", 50, -124, 50, "Charlie bio.", true);

INSERT INTO bby14_users (first_name, last_name, email, password, latitude, longitude, age, bio, is_admin) VALUES (
    "Delta", "User", "delta@my.bcit.ca", "user", 100, -52, 50, "Delta bio.", false);
    
INSERT INTO bby14_users (first_name, last_name, email, password, latitude, longitude, age, bio, is_admin) VALUES (
    "Echo", "User", "echo@my.bcit.ca", "user", 50, -125, 50, "Echo bio.", false);
    
    
    
    
    
INSERT INTO posts (userID, postNum, posts, postDate, postTime) VALUES (4, 1, "This is a test post",  "Friday May 20", "6:09 AM");