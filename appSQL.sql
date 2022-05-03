CREATE DATABASE IF NOT EXISTS db;

    CREATE TABLE login (
        email VARCHAR(50) PRIMARY KEY,
        password VARCHAR(50)
    );

    CREATE TABLE account (
        email VARCHAR(50), 
        name VARCHAR(50),
        age int,
        city VARCHAR(50),
        PRIMARY KEY (email),
        FOREIGN KEY (email) REFERENCES login(email)

    );

    CREATE table interests (
        email VARCHAR(50),
        interest VARCHAR(50),
        PRIMARY KEY (email),
        FOREIGN KEY (email) REFERENCES login(email)
    );