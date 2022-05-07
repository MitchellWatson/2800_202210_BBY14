CREATE DATABASE IF NOT EXISTS comp2800;
use comp2800;

CREATE TABLE IF NOT EXISTS bby14_users (
  ID int NOT NULL AUTO_INCREMENT,
  first_name varchar(30),
  last_name varchar(30),
  email varchar(30),
  password varchar(30),
  is_admin BOOLEAN,
  PRIMARY KEY (ID));

INSERT INTO bby14_users (first_name, last_name, email, password, is_admin) VALUES (
    "Alpha", "Admin", "alpha@my.bcit.ca", "admin", true);

INSERT INTO bby14_users (first_name, last_name, email, password, is_admin) VALUES (
    "Bravo", "User", "bravo@my.bcit.ca", "user", false);

INSERT INTO bby14_users (first_name, last_name, email, password, is_admin) VALUES (
    "Charlie", "Admin", "charlie@my.bcit.ca", "admin", true);

INSERT INTO bby14_users (first_name, last_name, email, password, is_admin) VALUES (
    "Delta", "User", "delta@my.bcit.ca", "user", false);