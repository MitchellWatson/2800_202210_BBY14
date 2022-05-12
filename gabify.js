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
    
        // This block of code to do admin authentication is from Princeton.
    if (req.session.loggedIn ) {
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
        res.redirect("/");
    }
});






app.post("/login", async (req, res) => {
    res.setHeader("Content-Type", "application/json");

    
  let username = req.body.email;
  let password = req.body.password;


    const connection = await mysql.createConnection({
        host: "127.0.0.1",
        user: "root",
        password: "",
        multipleStatements: "true"
    });

let [results, fields] = await connection.query("SELECT * FROM bby14_users WHERE email = ? AND password = ?", [username, password]);


if (results.length === 0) {
    res.send({ "status": "fail", "message": "Incorrect username or password" });
  } else {

    let user = results[0];

    let userId = user.ID;
    let userFirstName = user.first_name;
    let userLastName = user.last_name;
    let userEmail = user.email;
    let userPass = user.password;
    let isAdmin = user.is_admin;

    req.session.loggedIn = true;

    req.session.username = userId;
    req.session.firstName = userFirstName;
    req.session.lastName = userLastName;
    req.session.email = userEmail;
    req.session.password = userPass;
    req.session.usertype = isAdmin;


    res.send({ status: "success", message: "Logged in" });
  }
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