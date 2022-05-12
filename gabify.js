// Code to do server side is adapted from a COMP 1537 assignment.
"use strict";
const express = require("express");
const session = require("express-session");
const fs = require("fs");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/html", express.static("./app/html"));
app.use("/images", express.static("./public/images"));
app.use("/styles", express.static("./public/styles"));
app.use("/scripts", express.static("./public/scripts"));

app.use(session(
    {
        secret: "$zw+qzKh+&?b9}-v",
        resave: false,
        saveUninitialized: true
    })
);

app.get("/", function (req, res) {
    if (req.session.loggedIn) {
        res.redirect("/profile");
    } else {
        let doc = fs.readFileSync("./app/html/login.html", "utf8");
        res.send(doc);
    }
});

app.get("/game", function (req, res) {
    if (req.session.loggedIn) {
        let profile = fs.readFileSync("./app/html/game.html", "utf8");
        let profileDOM = new JSDOM(profile);
        res.send(profileDOM.serialize());
    } 
     else {
        let doc = fs.readFileSync("./app/html/login.html", "utf8");
        res.send(doc);
    }
});



app.get("/profile", function (req, res) {
    if (req.session.loggedIn) {
        // This block of code to do admin authentication is from Princeton.
        if (req.session.userType) {
            let profile = fs.readFileSync("./app/html/admin.html", "utf8");
            let profileDOM = new JSDOM(profile);
            let profileName = profileDOM.window.document.createElement("p");
            profileName.setAttribute("class", "welcomeBack");
            profileName.insertAdjacentText("beforeend", `Welcome back, ${req.session.name}`);
            let profileWelcome = profileDOM.window.document.querySelector("#welcome");
            profileWelcome.insertAdjacentElement("beforeend", profileName);
            res.send(profileDOM.serialize());
        } else {
            let profile = fs.readFileSync("./app/html/profile.html", "utf8");
            let profileDOM = new JSDOM(profile);
            let profileName = profileDOM.window.document.createElement("p");
            profileName.setAttribute("class", "welcomeBack");
            profileName.insertAdjacentText("beforeend", `Welcome back, ${req.session.name}`);
            let profileWelcome = profileDOM.window.document.querySelector("#welcome");
            profileWelcome.insertAdjacentElement("beforeend", profileName);
            res.send(profileDOM.serialize());
        }
    } else {
        // not logged in - no session and no access, redirect to home!
        res.redirect("/");
    }
});

app.post("/login", function (req, res) {
    res.setHeader("Content-Type", "application/json");
    const mysql = require("mysql2");
    const connection = mysql.createConnection({
        host: "127.0.0.1",
        user: "root",
        password: "",
        multipleStatements: "true"
    });
    connection.connect();
    // This block of code to do admin authentication is adapted Princeton's.
    const loginInfo = `USE comp2800; SELECT * FROM bby14_users WHERE email = '${req.body.email}' AND password = '${req.body.password}';`;
    connection.query(loginInfo, function (error, results, fields) {
        if (error) {
            // change this to notify user of error
        } else if (results[1].length == 0) {
            res.send({ status: "fail", msg: "Incorrect email or password" });
        } else {
            let validUserInfo = results[1][0];
            req.session.loggedIn = true;
            req.session.email = validUserInfo.email;
            req.session.name = validUserInfo.first_name;
            req.session.identity = validUserInfo.ID;
            req.session.userType = validUserInfo.is_admin;
            req.session.save(function (err) {
                // session saved. for analytics we could record this in db
            })
            res.send({ status: "success", msg: "Logged in." });
        }
    })
    connection.end();
});

app.get("/logout", function (req, res) {
    if (req.session) {
        req.session.destroy(function (error) {
            if (error) {
                res.status(400).send("Cannot log out")
            } else {
                res.redirect("/");
            }
        });
    }
});

let port = 8000;
app.listen(port, function () {
    console.log("Listening on port " + port + "!");
});