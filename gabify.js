// "use strict";
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

app.get("/profile", function (req, res) {
    // Check if user properly authenticated and logged in
    if (req.session.loggedIn) {
        if (req.session.userType) {
            let profile = fs.readFileSync("./app/html/admin.html", "utf8");
            res.send(profile);
        } else {
            let profile = fs.readFileSync("./app/html/profile.html", "utf8");
            res.send(profile);
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
