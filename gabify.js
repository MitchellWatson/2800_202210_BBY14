"use strict";
const express = require("express");
const session = require("express-session");
const fs = require("fs");
const app = express();
const mysql = require("mysql2/promise");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;



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
    
    // global.document = new JSDOM('/profile').window.document;
 
    // const x = document.getElementById("test").innerHTML;
    // x.innerHTML = `Welcome back ${req.session.userFirstName}`;
    if (req.session.loggedIn ) {
        if (req.session.userType) {
            let profile = fs.readFileSync("./app/html/admin.html", "utf8");
            res.send(profile);
        } else {
            let profile = fs.readFileSync("./app/html/profile.html", "utf8");
            res.send(profile);
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
        password: "password",
        //change this to COMP2800
        database: "comp2800",
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
                res.status(400).send("Cannot log out");
            } else {
                res.redirect("/");
            }
        });
    }
});

let port = 8000;
app.listen(port, function () {
});
