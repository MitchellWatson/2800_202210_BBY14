DROP DATABASE IF EXISTS heroku_2e384c4e07a3778;

CREATE DATABASE IF NOT EXISTS heroku_2e384c4e07a3778;

USE heroku_2e384c4e07a3778;

SET @@auto_increment_increment=1;
SET @@auto_increment_offset=1;

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
  hobbies varchar(100),
  is_admin BOOLEAN,
  UNIQUE(email),
  PRIMARY KEY (ID));

ALTER TABLE bby14_users AUTO_INCREMENT=1;

CREATE TABLE IF NOT EXISTS Meet (
requestor INTEGER,
requestee INTEGER,
place varchar(100),
date DATETIME,
reason varchar(100),
accepted BOOLEAN,
viewed BOOLEAN,
reqNum INTEGER auto_increment,
PRIMARY KEY(reqNum),
FOREIGN KEY (requestor) REFERENCES bby14_users(ID),
FOREIGN KEY (requestee) REFERENCES bby14_users(ID));

CREATE TABLE IF NOT EXISTS Friends (
user INTEGER,
friend INTEGER,
PRIMARY KEY(user, friend),
FOREIGN KEY (user) REFERENCES bby14_users(ID),
FOREIGN KEY (friend) REFERENCES bby14_users(ID));

CREATE TABLE IF NOT EXISTS UserPhotos (
userID INTEGER,
imageID VARBINARY(700),
PRIMARY KEY(userID, imageID),
FOREIGN KEY (userID) REFERENCES bby14_users(ID));

CREATE TABLE IF NOT EXISTS Posts (
userID INTEGER,
postNum INTEGER NOT NULL auto_increment,
posts LONGTEXT,
postDate DATE,
postTime TIME,
PRIMARY KEY(userID, postNum),
KEY (postNum),
FOREIGN KEY(userID) REFERENCES bby14_users(ID));

INSERT INTO bby14_users (first_name, last_name, email, password, latitude, longitude, age, bio, hobbies, is_admin) VALUES (
    "Alpha", "Admin", "alpha@my.bcit.ca", "admin", 50, -121.8, 50, "Hello all. I like to enjoy life to its fullest.", "Walking, Hiking, Nature", true);

INSERT INTO bby14_users (first_name, last_name, email, password, latitude, longitude, age, bio, hobbies, is_admin) VALUES (
    "Bravo", "User", "bravo@my.bcit.ca", "user", 50, -122, 50, "Im old but not that old.", "Knitting, Bingo, Cooking", false);

INSERT INTO bby14_users (first_name, last_name, email, password, latitude, longitude, age, bio, hobbies, is_admin) VALUES (
    "Charlie", "Admin", "charlie@my.bcit.ca", "admin", 50, -122.1, 50, "I see the good in life and want to talk to others.", "Poker, Alcohol", true);

INSERT INTO bby14_users (first_name, last_name, email, password, latitude, longitude, age, bio, hobbies, is_admin) VALUES (
    "Delta", "User", "delta@my.bcit.ca", "user", 100, -122.4, 50, "Me and my wife would like to find another walking partner", "Walking, Hiking, Outdoors", false);
    
INSERT INTO bby14_users (first_name, last_name, email, password, latitude, longitude, age, bio, hobbies, is_admin) VALUES (
    "Echo", "User", "echo@my.bcit.ca", "user", 50, -122.3, 50, "Just enjoying the ride", "Fishing, Outdoors", false);

INSERT INTO posts (userID, postNum, posts, postDate, postTime) VALUES (4, 3, "Went to mall today. Had fun.", '2022-05-21', "12:30:00");    
INSERT INTO posts (userID, postNum, posts, postDate, postTime) VALUES (4, 1, "Enjoyed watching the birds", '2022-05-20', "12:40:00");
INSERT INTO posts (userID, postNum, posts, postDate, postTime) VALUES (4, 2, "Went to park", '2022-05-19', "12:50:00");