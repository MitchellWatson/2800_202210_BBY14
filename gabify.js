// Code to do server side is adapted from a COMP 1537 assignment.
"use strict";
const express = require("express");
const session = require("express-session");
const fs = require("fs");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const mysql = require('mysql2/promise');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

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
        res.redirect("/main");
    } else {
        let doc = fs.readFileSync("./app/html/login.html", "utf8");
        res.send(doc);
    }
});

app.get("/game", function (req, res) {
    if (req.session.loggedIn) {
        let profile = fs.readFileSync("./app/html/game.html", "utf8");
        let profileDOM = new JSDOM(profile);

        let navBar = fs.readFileSync("./app/html/nav.html", "utf8");
        let navBarDOM = new JSDOM(navBar);
        let string = `Game`;
        let t = navBarDOM.window.document.createTextNode(string);
        navBarDOM.window.document.querySelector("#welcome").appendChild(t);

        profileDOM.window.document.querySelector("#header").innerHTML = navBarDOM.window.document.querySelector("#header").innerHTML;
        res.send(profileDOM.serialize());
    } 
     else {
        let doc = fs.readFileSync("./app/html/login.html", "utf8");
        res.send(doc);
    }
});

app.get("/friendFinder", function (req, res) {
    if (req.session.loggedIn) {
        let profile = fs.readFileSync("./app/html/friendFinder.html", "utf8");
        let profileDOM = new JSDOM(profile);

        let navBar = fs.readFileSync("./app/html/nav.html", "utf8");
        let navBarDOM = new JSDOM(navBar);
        let string = `Friend Finder`;
        let t = navBarDOM.window.document.createTextNode(string);
        navBarDOM.window.document.querySelector("#welcome").appendChild(t);

        profileDOM.window.document.querySelector("#header").innerHTML = navBarDOM.window.document.querySelector("#header").innerHTML;
        res.send(profileDOM.serialize());
    } 
     else {
        let doc = fs.readFileSync("./app/html/login.html", "utf8");
        res.send(doc);
    }
});

app.get("/user", function (req, res) {
    if (req.session.loggedIn) {
        let profile = fs.readFileSync("./app/html/userProfiles.html", "utf8");
        let profileDOM = new JSDOM(profile);

        let navBar = fs.readFileSync("./app/html/nav.html", "utf8");
        let navBarDOM = new JSDOM(navBar);
        let string = `Profile`;
        let t = navBarDOM.window.document.createTextNode(string);
        navBarDOM.window.document.querySelector("#welcome").appendChild(t);

        profileDOM.window.document.querySelector("#header").innerHTML = navBarDOM.window.document.querySelector("#header").innerHTML;
        res.send(profileDOM.serialize());
    } 
     else {
        let doc = fs.readFileSync("./app/html/login.html", "utf8");
        res.send(doc);
    }
});

app.get("/userProfiles", function (req, res) {
    if (req.session.loggedIn) {
        let profile = fs.readFileSync("./app/html/userProfiles.html", "utf8");
        let profileDOM = new JSDOM(profile);

        let navBar = fs.readFileSync("./app/html/nav.html", "utf8");
        let navBarDOM = new JSDOM(navBar);
        let string = `Profile`;
        let t = navBarDOM.window.document.createTextNode(string);
        navBarDOM.window.document.querySelector("#welcome").appendChild(t);

        profileDOM.window.document.querySelector("#header").innerHTML = navBarDOM.window.document.querySelector("#header").innerHTML;
        
        res.send(profileDOM.serialize());
    } 
     else {
        let doc = fs.readFileSync("./app/html/login.html", "utf8");
        res.send(doc);
    }
});


app.get("/main", function (req, res) {
    
    if (req.session.loggedIn ) {
        if (req.session.userType) {
            
            let profile = fs.readFileSync("./app/html/admin.html", "utf8");
            let profileDOM = new JSDOM(profile);

            let navBar = fs.readFileSync("./app/html/nav.html", "utf8");
            let navBarDOM = new JSDOM(navBar);
            let string = `Admin`;
            let t = navBarDOM.window.document.createTextNode(string);
            navBarDOM.window.document.querySelector("#welcome").appendChild(t);

            profileDOM.window.document.querySelector("#header").innerHTML = navBarDOM.window.document.querySelector("#header").innerHTML;
            res.send(profileDOM.serialize());

        } else {
            let profile = fs.readFileSync("./app/html/main.html", "utf8");
            let profileDOM = new JSDOM(profile);

            let navBar = fs.readFileSync("./app/html/nav.html", "utf8");
            let navBarDOM = new JSDOM(navBar);
            let string = `Home`;

            let t = navBarDOM.window.document.createTextNode(string);
            navBarDOM.window.document.querySelector("#welcome").appendChild(t);

            profileDOM.window.document.querySelector("#header").innerHTML = navBarDOM.window.document.querySelector("#header").innerHTML;
            res.send(profileDOM.serialize());
        }
    } else {
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
        database: "comp2800",
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
            res.send({ status: "fail", msg: "Incorrect email or password!" });
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


app.get("/redirectToUsers", function (req, res) {
    if (req.session.loggedIn) {
        if(req.session.userType) {
            connection.connect();
             const getUsers = `USE comp2800; SELECT * FROM bby_users;`;
             //change this
            let doc = fs.readFileSync("./app/html/userProfiles.html", "utf8");
            let adminDoc = new JSDOM(doc);

            let cardDoc = fs.readFileSync("./app/html/profileCards.html", "utf8");
            let cardDOM = new JSDOM(cardDoc);

           
            let numUsers = 9;


            for(let x = 0; x < numUsers; x++) {
                adminDoc.window.document.querySelector("#main").innerHTML 
                    += cardDOM.window.document.querySelector(".card").innerHTML;
            //     let usersList = adminDoc.window.document.querySelector("#main").innerHTML;
            //     let userCards = cardDOM.window.document.querySelector(".card").innerHTML;
            //    usersList.insertAdjacentElement("beforeend", userCards);
            }
            res.send(adminDoc.serialize());
        }
    } else {
        let redirect = fs.readFileSync("./app/html/login.html", "utf8");
        res.send(redirect);
    }
});

// Code to upload an image.
// Adapted from Mutler and COMP 2537 example.
// start of upload-app.js
const multer = require("multer");
const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, "./app/avatar/")
    },
    filename: function(req, file, callback) {
        // callback(null, "avatar_" + file.originalname.split('/').pop().trim());
        const sessionID = "" + req.session.identity;
        callback(null, "avatar_" + sessionID + "." + file.originalname.split(".").pop());
    }
});

const upload = multer({ storage: storage });


//do we need this??
app.get('/', function (req, res) {
    let doc = fs.readFileSync('./app/html/index.html', "utf8");
    res.send(doc);

});



// app.post('/upload-images', upload.array("files"), function (req, res) {

//     res.setHeader("Content-Type", "application/json");
//     const mysql = require("mysql2");
//     const connection = mysql.createConnection({
//         host: "127.0.0.1",
//         user: "root",
//         password: "password",
//         multipleStatements: "true"
//     });

//     connection.connect();


//     const profilePic = `USE comp2800; SELECT imageID FROM userphotos WHERE userID = '${req.session.identity}';`;

//     connection.query(profilePic, function(error, results, fields) {
//         if (error) {
//         } 
//         else if (results[1].length == 0) {
//             res.send({ status: "fail", msg: "Incorrect email or password" });
//         } else 
//     })


//     for(let i = 0; i < req.files.length; i++) {
//         req.files[i].filename = req.files[i].originalname;
//     }

    
// });

// end of upload-app.js

// //For Milestone hand-ins:
// let port = 8000;
// app.listen(port, function () {
// });

//For Heroku deployment
app.listen(process.env.PORT || 3000);

app.