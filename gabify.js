"use strict";
const express = require("express");
const session = require("express-session");
const fs = require("fs");
const app = express();
// const mysql = require("mysql2/promise");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

//connection
const mysql = require("mysql2");
const connection = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "password",
    multipleStatements: "true"
    });


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/html", express.static("./app/html"));
app.use("/images", express.static("./public/images"));
app.use("/styles", express.static("./public/styles"));
app.use("/scripts", express.static("./public/scripts"));

app.use(session({
        secret: "$zw+qzKh+&?b9}-v",
        resave: false,
        saveUninitialized: true
    })
);

app.get("/", function (req, res) {
    if (req.session.loggedIn) {
        res.redirect("/profile");
    } 
     else {
        let doc = fs.readFileSync("./app/html/login.html", "utf8");
        res.send(doc);
    }
});


app.get("/profile", function (req, res) {
    // Check if user properly authenticated and logged in
    if (req.session.loggedIn) {
        if (req.session.userType) {
            let profile = fs.readFileSync("./app/html/admin.html", "utf8");
            let profileDOM = new JSDOM(profile);

            let headerDOC = fs.readFileSync("./app/html/nav.html", "utf8");
            let headerDOM = new JSDOM(headerDOC)

            profileDOM.window.document.querySelector("#header").innerHTML 
                = headerDOM.window.document.querySelector("#header").innerHTML;

            let profileName = profileDOM.window.document.createElement("p");
            profileName.setAttribute("class", "welcomeBack");
            profileName.insertAdjacentText("beforeend", `Welcome back admin ${req.session.name}`);
            let profileWelcome = profileDOM.window.document.querySelector("#welcome");
            profileWelcome.insertAdjacentElement("beforeend", profileName);
            res.send(profileDOM.serialize());
        } else {
            let profile = fs.readFileSync("./app/html/profile.html", "utf8");
            let profileDOM = new JSDOM(profile);

            let headerDOC = fs.readFileSync("./app/html/nav.html", "utf8");
            let headerDOM = new JSDOM(headerDOC)

            profileDOM.window.document.querySelector("#header").innerHTML 
                = headerDOM.window.document.querySelector("#header").innerHTML;

            let profileName = profileDOM.window.document.createElement("p");
            profileName.setAttribute("class", "welcomeBack");
            profileName.insertAdjacentText("beforeend", `Welcome back user ${req.session.name}`);
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
    

    connection.connect();
    // Checks if user typed in matching email and password
    const loginInfo = `USE comp2800; SELECT * FROM bby14_users WHERE email = '${req.body.email}' AND password = '${req.body.password}';`;
    connection.query(loginInfo, function (error, results, fields) {
        /* If there is an error, alert user of error
        *  If the length of results array is 0, then there was no matches in database
        *  If no error, then it is valid login and save info for session
        */
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
                res.status(400).send("Cannot log out");
            } else {
                res.redirect("/");
            }
        });
    }
});

app.get("/redirectToUsers", function (req, res) {
    if (req.session.loggedIn) {
        if(req.session.userType) {
            connection.connect();
            let doc = fs.readFileSync("./app/html/userProfiles.html", "utf8");
            let adminDoc = new JSDOM(doc);

            let cardDoc = fs.readFileSync("./app/html/profileCards.html", "utf8");
            let cardDOM = new JSDOM(cardDoc);

            const getUsers = `USE comp2800; SELECT * FROM bby_users;`;
            let numUsers;
            
            connection.query(getUsers, function (error, results, fields) {
               numUsers = results; 
               
            });


            for(let x = 0; x < numUsers; x++) {
                adminDoc.window.document.querySelector("#main").innerHTML 
                    += cardDOM.window.document.querySelector(".card").innerHTML;
            }

            res.send(adminDoc.serialize());
        }
    } else {
        let redirect = fs.readFileSync("./app/html/login.html", "utf8");
        res.send(redirect);
    }
    connection.end();
});

let port = 8000;
app.listen(port, function () {
});


module.exports = connection;