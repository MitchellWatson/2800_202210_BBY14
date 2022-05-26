/** The following code contains server-side used to read and write changes into the database 
 *      as well as changes to the front-end using Javascript and the DOM. 
* @author   Mitchell Watson
* @author   Jackie Ma
* @author   Basillio Kim
* @author   Ryan Chau
*/
"use strict";

//List of all modules and dependencies installed through node.jsconst express = require("express");
const express = require("express");
const session = require("express-session");
const fs = require("fs");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const mysql = require('mysql2');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const socketio = require('socket.io');
const bodyparser = require('body-parser');
const path = require('path');
const { connect } = require("http2");
const multer = require('multer');
const { Blob } = require("buffer");

const http = require('http');
const server = http.createServer(app);
const io = socketio(server);
const formatMessage = require('./helpers/formatDate')

// Custom imported modules used as helper methods for the chat features. 
const {
    getActiveUser,
    exitRoom,
    newUser,
    getIndividualRoomUsers
} = require('./helpers/userHelper');

const {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
} = require('./helpers/users');

//Static paths used through Express.js
app.use("/html", express.static("./app/html"));
app.use("/avatar", express.static("./app/avatar"));
app.use("/images", express.static("./public/images"));
app.use("/styles", express.static("./public/styles"));
app.use("/scripts", express.static("./public/scripts"));

//Initialization of the session.
app.use(session(
    {
        secret: "$zw+qzKh+&?b9}-v",
        resave: false,
        saveUninitialized: true
    })
);

// body-parser middleware use
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({
    extended: true
}))

// local db
const dbHost = "127.0.0.1";
const dbUser = "root";
const dbPassword = "passwordSQL";
const dbName = "comp2800";

// heroku db
// const dbHost = "us-cdbr-east-05.cleardb.net";
// const dbUser = "b959a83957277c";
// const dbPassword = "5e9f74c2";
// const dbName = "heroku_2e384c4e07a3778";

const connection = mysql.createPool({
    host: dbHost,
    user: dbUser,
    password: dbPassword,
    database: dbName,
    multipleStatements: "true"
});

// Session redirect.
// Will fetch skeleton nav and footer and assign page title
// If logged in, depending on user type, will divert to main pahe
// Of not logged in, will divert to login page
app.get("/", function (req, res) {
    if (req.session.loggedIn) {
        res.redirect("/main");
    } else {
        let doc = fs.readFileSync("./app/html/login.html", "utf8");
        res.send(doc);
    }
});

// Session redirect.
// Will redirect to register page
app.get("/register", function (req, res) {
    let profile = fs.readFileSync("./app/html/register.html", "utf8");
    let profileDOM = new JSDOM(profile);
    res.send(profileDOM.serialize());
});

// Session redirect.
// Will fetch skeleton nav and footer and assign page title
// Will check if logged in, then rediect to game page
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

// Session redirect.
// Will fetch skeleton nav and footer and assign page title
// If logged in, will redirect to help page, if not, back to login
app.get("/help", function (req, res) {
    if (req.session.loggedIn) {
        let profile = fs.readFileSync("./app/html/help.html", "utf8");
        let profileDOM = new JSDOM(profile);

        let navBar = fs.readFileSync("./app/html/nav.html", "utf8");
        let navBarDOM = new JSDOM(navBar);
        let string = `Help`;
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

// Session redirect.
// Will fetch skeleton nav and footer and assign page title
// If logged in, will redirect to meet-ups menu page, if not, back to login
app.get("/meet", function (req, res) {
    if (req.session.loggedIn) {
        let profile = fs.readFileSync("./app/html/meet.html", "utf8");
        let profileDOM = new JSDOM(profile);

        let navBar = fs.readFileSync("./app/html/nav.html", "utf8");
        let navBarDOM = new JSDOM(navBar);
        let string = `Meet-Up`;
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

// Session redirect.
// Will fetch skeleton nav and footer and assign page title
// If logged in, will redirect to timeline page, if not, back to login
app.get("/timeline", function (req, res) {
    if (req.session.loggedIn) {
        let profile = fs.readFileSync("./app/html/timeline.html", "utf8");
        let profileDOM = new JSDOM(profile);

        // Queries for all posts in descending order by date
        connection.query(
            "SELECT * FROM posts ORDER BY postDate DESC",
            function (error, results, fields) {
                if (error) {
                    console.log(error);
                }

                // Gets all posts posted by user
                let newResults = [];
                for (let i = 0; i < results.length; i++) {
                    if (results[i].userID == req.session.identity) {
                        newResults[newResults.length] = results[i];
                    }
                }

                // Create dynamic html insert div
                const usersProfiles = profileDOM.window.document.createElement("div");
                let users;
                var old = "";

                // Takes date posted and reformats into readble text
                for (let i = 0; i < newResults.length; i++) {
                    let dob = newResults[i].postDate
                    var dobArr = dob.toDateString().split(' ');
                    var dobFormat = dobArr[1] + ' ' + dobArr[2] + ', ' + dobArr[3];
                    if (dobFormat.localeCompare(old) != 0) {
                        old = dobFormat;
                        users = '<h2>' + dobFormat + '</h2>';
                        usersProfiles.innerHTML += users;
                    }
                    // Appends all posts into cards for html
                    users =
                        '<div class="card">' +
                        '<div class="can">' +
                        '<p style="text-decoration: underline;" value="' + newResults[i].postNum + '" id="numInput' + newResults[i].userID + '" >Memory #' + (newResults.length - i) + '</p>' +
                        '<p style="text-decoration: underline;">Description</p>' +
                        '<input type="text" id="descInput' + newResults[i].postNum + '" placeholder="e.g. John" value="' + newResults[i].posts + '"></input>' +
                        '<p>Posted at: ' + newResults[i].postTime + '</p>' +
                        '</div>' +
                        '<div id="options">' +
                        '<a target="' + newResults[i].postNum + '" class="option update">Update</a>' +
                        '</div>' +
                        '</div>';
                    usersProfiles.innerHTML += users;
                }
                if (newResults.length == 0) {
                    users = '<p>No memories. Start making some today!</p>';
                    usersProfiles.innerHTML += users;
                }
                profileDOM.window.document.getElementById("user_table").appendChild(usersProfiles);

                let navBar = fs.readFileSync("./app/html/nav.html", "utf8");
                let navBarDOM = new JSDOM(navBar);
                let string = `Journal`;
                let t = navBarDOM.window.document.createTextNode(string);
                navBarDOM.window.document.querySelector("#welcome").appendChild(t);

                profileDOM.window.document.querySelector("#header").innerHTML = navBarDOM.window.document.querySelector("#header").innerHTML;

                res.send(profileDOM.serialize());
            }
        );
    } else {
        let doc = fs.readFileSync("./app/html/login.html", "utf8");
        res.send(doc);
    }
})


// Session redirect.
// Will fetch skeleton nav and footer and assign page title
// If logged in, will redirect to request page in meet-up, if not, back to login
app.get("/request", function (req, res) {
    if (req.session.loggedIn) {
        let profile = fs.readFileSync("./app/html/request.html", "utf8");
        let profileDOM = new JSDOM(profile);
        let listUsers = [];

        // Selects all users from database
        connection.query('SELECT * FROM bby14_users;',
            function (error, results, fields) {
                if (error) {
                    console.log(error);
                }

                // Appends all users to list
                for (let i = 0; i < results.length; i++) {
                    listUsers[listUsers.length] = results[i];
                }

                // Selects all friend relationships from database
                connection.query(
                    "SELECT * FROM friends;",
                    function (error, results, fields) {
                        if (error) {
                            console.log(error);
                        }
                        // Checks and append if friends are with user
                        let listFriends = [];
                        for (let i = 0; i < results.length; i++) {
                            if (results[i].user == req.session.identity) {
                                listFriends[listFriends.length] = results[i];
                            }
                        }

                        // Checks if friends have both friended each other
                        let friends = [];
                        for (let i = 0; i < listFriends.length; i++) {
                            for (let k = 0; k < results.length; k++) {
                                if (listFriends[i].friend == results[k].user & results[k].friend == listFriends[i].user) {
                                    friends[friends.length] = listFriends[i];
                                }
                            }
                        }

                        // Filters out null list appendices
                        friends = friends.filter(function (e) {
                            return e != null;
                        })

                        // References list of users and list of friends
                        let finalUsers = [];
                        for (let i = 0; i < friends.length; i++) {
                            for (let k = 0; k < listUsers.length; k++) {
                                if (friends[i].friend == listUsers[k].ID) {
                                    finalUsers[finalUsers.length] = listUsers[k];
                                }
                            }
                        }

                        // Creates html div to append request menu to
                        const usersProfiles = profileDOM.window.document.createElement("div");
                        let users;
                        users =
                            '<div id="drop">' +
                            '<div class="card2">' +
                            '<div class="can">' +
                            '<p style="text-decoration: underline;">Choose Friend</p>' +
                            '<select type="date" id="personInput" placeholder="Select Friend">';

                        // Gives option to meet for each friend    
                        for (let i = 0; i < finalUsers.length; i++) {
                            users += '<option value="' + finalUsers[i].ID + '">' + finalUsers[i].first_name + ' ' + finalUsers[i].last_name + '</option>';
                        }
                        users +=
                            '</select>' +
                            '<p style="text-decoration: underline;">When</p>' +
                            '<input type="datetime-local" id="dateInput">' +
                            '<p style="text-decoration: underline;">Where</p>' +
                            '<input type="text" id="placeInput" placeholder="Address or Location">' +
                            '<p style="text-decoration: underline;">Occasion</p>' +
                            '<input type="text" id="reasonInput" placeholder="Reason for outing">' +
                            '<a href=""><button id="request" class="option">Request</button></a>' +
                            '</div>' +
                            '</div>' +
                            '</div>';

                        // Appends menu users card to html id    
                        usersProfiles.innerHTML += users;
                        profileDOM.window.document.getElementById("user_table").appendChild(usersProfiles);

                        let navBar = fs.readFileSync("./app/html/nav.html", "utf8");
                        let navBarDOM = new JSDOM(navBar);
                        let string = `Request`;
                        let t = navBarDOM.window.document.createTextNode(string);
                        navBarDOM.window.document.querySelector("#welcome").appendChild(t);
                        profileDOM.window.document.querySelector("#header").innerHTML = navBarDOM.window.document.querySelector("#header").innerHTML;

                        res.send(profileDOM.serialize());
                    }
                );
            });
    }
    else {
        let doc = fs.readFileSync("./app/html/login.html", "utf8");
        res.send(doc);
    }
});

// Session redirect.
// Will fetch skeleton nav and footer and assign page title
// If logged in, will redirect to schedule page in meet-up, if not, back to login
app.get("/schedule", function (req, res) {
    if (req.session.loggedIn) {
        let profile = fs.readFileSync("./app/html/schedule.html", "utf8");
        let profileDOM = new JSDOM(profile);
        let listUsers = [];

        // Gets list of users from database
        connection.query('SELECT * FROM bby14_users;',
            function (error, results, fields) {
                if (error) {
                    console.log(error);
                }

                // Filters and appends users to list
                for (let i = 0; i < results.length; i++) {
                    listUsers[listUsers.length] = results[i];
                }

                // Gets meets from database in DESC order
                connection.query(
                    "SELECT * FROM meet ORDER BY date ASC;",
                    function (error, results, fields) {
                        if (error) {
                            console.log(error);
                        }

                        // Gets all meets that include the user and is today's date or later
                        let newResults = []
                        for (let i = 0; i < results.length; i++) {
                            if ((results[i].requestee == req.session.identity || results[i].requestor == req.session.identity) && results[i].viewed == 1 & results[i].accepted == 1) {
                                    newResults[newResults.length] = results[i];
                            }
                        }

                        // Creates div html element to dynamically populate meet cards
                        const usersProfiles = profileDOM.window.document.createElement("div");
                        let users;
                        for (let i = 0; i < newResults.length; i++) {
                            users =
                                '<div class="card2">' +
                                '<div class="can">' +
                                '<h2>Meet-up</h2>' +
                                '<p class="orange">Who</p>' +
                                '<p>';
                            for (let k = 0; k < listUsers.length; k++) {
                                if (newResults[i].requestee == listUsers[k].ID && newResults[i].requestee != req.session.identity) {
                                    users += listUsers[k].first_name + ' ' + listUsers[k].last_name;
                                } else if (newResults[i].requestor == listUsers[k].ID && newResults[i].requestor != req.session.identity) {
                                    users += listUsers[k].first_name + ' ' + listUsers[k].last_name;
                                }
                            }
                            users +=
                                '</p>' +
                                '<p class="orange">When</p>' +
                                '<p>' + newResults[i].date + '</p>' +
                                '<p class="orange">Where</p>' +
                                '<p>' + newResults[i].place + '</p>' +
                                '<p class="orange">Occasion</p>' +
                                '<p>' + newResults[i].reason + '</p>' +
                                '</div>' +
                                '</div>';
                            usersProfiles.innerHTML += users;
                        }

                        // If results are none, populate with message
                        if (newResults.length == 0) {
                            users = 'No meet-ups scheduled.';
                            usersProfiles.innerHTML += users;
                        }
                        profileDOM.window.document.getElementById("user_table").appendChild(usersProfiles);

                        let navBar = fs.readFileSync("./app/html/nav.html", "utf8");
                        let navBarDOM = new JSDOM(navBar);
                        let string = `Schedule`;
                        let t = navBarDOM.window.document.createTextNode(string);
                        navBarDOM.window.document.querySelector("#welcome").appendChild(t);
                        profileDOM.window.document.querySelector("#header").innerHTML = navBarDOM.window.document.querySelector("#header").innerHTML;
                        res.send(profileDOM.serialize());
                    }
                );
            });
    }
    else {
        let doc = fs.readFileSync("./app/html/login.html", "utf8");
        res.send(doc);
    }
});

// Session redirect.
// Will fetch skeleton nav and footer and assign page title
// If logged in, will redirect to incoming page in meet-up, if not, back to login
app.get("/incoming", function (req, res) {
    if (req.session.loggedIn) {
        let profile = fs.readFileSync("./app/html/incoming.html", "utf8");
        let profileDOM = new JSDOM(profile);
        let listUsers = [];

        // Select users from database
        connection.query('SELECT * FROM bby14_users;',
            function (error, results, fields) {
                if (error) {
                    console.log(error);
                }

                // Append users to list
                for (let i = 0; i < results.length; i++) {
                    listUsers[listUsers.length] = results[i];
                }

                // Select meet requests in date asc
                connection.query(
                    "SELECT * FROM meet ORDER BY date ASC;",
                    function (error, results, fields) {
                        if (error) {
                            console.log(error);
                        }

                        // Appends meet requests to list
                        let newResults = []
                        for (let i = 0; i < results.length; i++) {
                            if (results[i].requestee == req.session.identity && results[i].viewed == 0) {
                                newResults[newResults.length] = results[i];
                            }
                        }

                        // Create html div to append dynamic cards for user approval
                        const usersProfiles = profileDOM.window.document.createElement("div");
                        let users;
                        for (let i = 0; i < newResults.length; i++) {
                            users =
                                '<div id="drop">' +
                                '<div class="card2">' +
                                '<div class="can">' +
                                '<h2>Meet-up Request</h2>' +
                                '<p class="orange">Who</p>' +
                                '<p>';
                            for (let k = 0; k < listUsers.length; k++) {
                                if (newResults[i].requestor == listUsers[k].ID) {
                                    users += listUsers[k].first_name + ' ' + listUsers[k].last_name;
                                }
                            }
                            users +=
                                '</p>' +
                                '<p class="orange">When</p>' +
                                '<p>' + newResults[i].date + '</p>' +
                                '<p class="orange">Where</p>' +
                                '<p>' + newResults[i].place + '</p>' +
                                '<p class="orange">Occasion</p>' +
                                '<p>' + newResults[i].reason + '</p><br>' +
                                '<a class="accept option" target="' + newResults[i].reqNum + '">Accept</a>' +
                                '<a class="decline option" target="' + newResults[i].reqNum + '">Decline</a>' +
                                '</div>' +
                                '</div>' +
                                '</div>';
                            usersProfiles.innerHTML += users;
                        }

                        // Appends message for new friend users
                        if (newResults.length == 0) {
                            users = 'No requests yet.';
                            usersProfiles.innerHTML += users;
                        }
                        profileDOM.window.document.getElementById("user_table").appendChild(usersProfiles);

                        let navBar = fs.readFileSync("./app/html/nav.html", "utf8");
                        let navBarDOM = new JSDOM(navBar);
                        let string = `Incoming`;
                        let t = navBarDOM.window.document.createTextNode(string);
                        navBarDOM.window.document.querySelector("#welcome").appendChild(t);
                        profileDOM.window.document.querySelector("#header").innerHTML = navBarDOM.window.document.querySelector("#header").innerHTML;
                        res.send(profileDOM.serialize());
                    }
                );
            });
    }
    else {
        let doc = fs.readFileSync("./app/html/login.html", "utf8");
        res.send(doc);
    }
});

// Session redirect.
// Will fetch skeleton nav and footer and assign page title
// If logged in, will redirect to contact page, if not, back to login
app.get("/contact", async function (req, res) {
    if (req.session.loggedIn) {
        let profile = fs.readFileSync("./app/html/contact.html", "utf8");
        let profileDOM = new JSDOM(profile);
        let listUsers = [];

        // Selects all users from database
        connection.query('SELECT * FROM bby14_users;',
            function (error, results, fields) {
                if (error) {
                    console.log(error);
                }

                // Appends users to list
                for (let i = 0; i < results.length; i++) {
                    listUsers[listUsers.length] = results[i];
                }

                // Selects all friend request from database
                connection.query(
                    "SELECT * FROM friends;",
                    function (error, results, fields) {
                        if (error) {
                            console.log(error);
                        }

                        // Appends all friends that include user to list
                        let listFriends = [];
                        for (let i = 0; i < results.length; i++) {
                            if (results[i].user == req.session.identity) {
                                listFriends[listFriends.length] = results[i];
                            }
                        }

                        // Appends all friends that both users have added eachother
                        let friends = [];
                        for (let i = 0; i < listFriends.length; i++) {
                            for (let k = 0; k < results.length; k++) {
                                if (listFriends[i].friend == results[k].user & results[k].friend == listFriends[i].user) {
                                    friends[friends.length] = listFriends[i];
                                }
                            }
                        }

                        // Filters null values in lists
                        friends = friends.filter(function (e) {
                            return e != null;
                        })

                        // Compares users from database and friend relationships into list
                        let finalUsers = [];
                        for (let i = 0; i < friends.length; i++) {
                            for (let k = 0; k < listUsers.length; k++) {
                                if (friends[i].friend == listUsers[k].ID) {
                                    finalUsers[finalUsers.length] = listUsers[k];
                                }
                            }
                        }

                        // Create div html to append dynamic friend cards
                        const usersProfiles = profileDOM.window.document.createElement("div");
                        let users;
                        for (let i = 0; i < finalUsers.length; i++) {
                            users =
                                '<div name="username" id="username" class="' + req.session.first_name + '"></div>' +
                                '<div class="card">' +
                                '<div class="name">' +
                                '<p class="head" >Name</p>' +
                                '<p id="name">' + finalUsers[i].first_name + ' ' + finalUsers[i].last_name + '</p>' +
                                '</div>' +
                                '<div class="age">' +
                                '<p class="head">Age</p>' +
                                '<p>' + finalUsers[i].age + '</p>' +
                                '</div>' +
                                '<div class="img">' +
                                '<img src="./avatar/avatar_' + finalUsers[i].ID + '.jpg">' +

                                '</div>' +
                                '<div class="bio">' +
                                '<p class="head">Bio</p>' +
                                '<p>' + finalUsers[i].bio + '</p>' +
                                '</div>' +
                                '<div class="hobbies">' +
                                '<p class="head">Hobbies</p>';
                            if (finalUsers[i].hobbies != null) {
                                users += '<p>' + finalUsers[i].hobbies + '</p>';
                            } else {
                                users += '<p>No hobbies listed</p>'
                            }
                            users += '</div>'
                            users +=
                                '<div class="button">' +
                                '<a href= "/gabChat" target="' + finalUsers[i].ID + '" class="option add"><span class="material-symbols-outlined">sms</span>Chat</a>' +
                                '</div>' +
                                '</div>';
                            usersProfiles.innerHTML += users;
                        }

                        // Appends message if no friends
                        if (friends.length == 0) {
                            users = 'No friends yet.';
                            usersProfiles.innerHTML += users;
                        }
                        profileDOM.window.document.getElementById("user_table").appendChild(usersProfiles);

                        let navBar = fs.readFileSync("./app/html/nav.html", "utf8");
                        let navBarDOM = new JSDOM(navBar);
                        let string = `Contact`;
                        let t = navBarDOM.window.document.createTextNode(string);
                        navBarDOM.window.document.querySelector("#welcome").appendChild(t);
                        profileDOM.window.document.querySelector("#header").innerHTML = navBarDOM.window.document.querySelector("#header").innerHTML;
                        res.send(profileDOM.serialize());
                    }
                );
            });
    }
    else {
        let doc = fs.readFileSync("./app/html/login.html", "utf8");
        res.send(doc);
    }
});

// Session redirect.
// If logged in, will redirect to user profile page, if not, back to login
app.get("/userProfiles", function (req, res) {
    if (req.session.loggedIn) {
        // Will fetch skeleton nav and footer and assign page title
        let profile = fs.readFileSync("./app/html/userProfiles.html", "utf8");
        let profileDOM = new JSDOM(profile);
        let navBar = fs.readFileSync("./app/html/nav.html", "utf8");
        let navBarDOM = new JSDOM(navBar);
        let string = `Profile`;
        let t = navBarDOM.window.document.createTextNode(string);
        navBarDOM.window.document.querySelector("#welcome").appendChild(t);
        profileDOM.window.document.querySelector("#header").innerHTML = navBarDOM.window.document.querySelector("#header").innerHTML;

        // Inserts user info from session into input files in profile
        profileDOM.window.document.querySelector("#emailInput").setAttribute('value', req.session.email);
        profileDOM.window.document.querySelector("#passwordInput").setAttribute('value', req.session.password);
        profileDOM.window.document.querySelector("#firstNameInput").setAttribute('value', req.session.first_name);
        profileDOM.window.document.querySelector("#lastNameInput").setAttribute('value', req.session.last_name);

        // Checks if age is not null and so wont input null
        if (req.session.age != null) {
            profileDOM.window.document.querySelector("#ageInput").setAttribute('value', req.session.age);
        }

        // Checks if age is not null so woth input null
        if (req.session.hobbies != null) {
            profileDOM.window.document.querySelector("#hobbiesInput").setAttribute('value', req.session.hobbies);
        }

        // Textarea populating from user session info
        const usersProfiles = profileDOM.window.document.createElement("div");
        if (req.session.bio != null) {
            usersProfiles.innerHTML = '<textarea rows="4" id="bioInput" value="" type="text" required="required" maxlength="100" placeholder="Tell us about yourself!">' + req.session.bio + '</textarea>';
        } else {
            usersProfiles.innerHTML = '<textarea rows="4" id="bioInput" value="" type="text" required="required" maxlength="100" placeholder="Tell us about yourself!"></textarea>';
        }
        profileDOM.window.document.getElementById("bio").appendChild(usersProfiles);

        // Gets profile picture of user
        let img = profileDOM.window.document.querySelector('#avatar');
        img.src = './avatar/avatar_' + req.session.identity + '.jpg';
        res.send(profileDOM.serialize());
    }
    else {
        let doc = fs.readFileSync("./app/html/login.html", "utf8");
        res.send(doc);
    }
});

// Database insert.
// Gets meet-up request from client side
app.post('/addRequest', function (req, res) {
    res.setHeader('Content-Type', 'application/json');

    // Adds row to meet table from user inputed request
    connection.query('INSERT INTO meet VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [req.session.identity, req.body.requestee, req.body.place, req.body.date, req.body.reason, 0, 0, req.body.id],
        function (error, results, fields) {
            if (error) {
                console.log(error);
                res.send({
                    status: "fail",
                    msg: "Recorded not updated."
                });
            } else {
                res.send({
                    status: "success",
                    msg: "Recorded updated."
                });
            }
        });
});

// Database insert.
// Gets account creation registration from client side
app.post('/create', function (req, res) {
    res.setHeader('Content-Type', 'application/json');

    // Adds row to users table from user registration
    connection.query('INSERT INTO bby14_users VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [req.body.ID, req.body.first_name, req.body.last_name, req.body.email, req.body.password, req.body.latitude, req.body.longitude, null, null, null, 0],
        function (error, results, fields) {
            if (error) {
                console.log(error);
                res.send({
                    status: "fail",
                    msg: "Recorded failed."
                });
            } else {
                res.send({
                    status: "success",
                    msg: "Recorded updated."
                });
            }
        });
});

// Database insert.
// Gets journal info from client side
app.post('/addTimeline', function (req, res) {
    res.setHeader('Content-Type', 'application/json');

    // Adds timeline client side inputed info into posts table
    connection.query('INSERT INTO posts VALUES (?, ?, ?, ?, ?)',
        [req.session.identity, req.body.unknown, req.body.posts, req.body.postDate, req.body.postTime],
        function (error, results, fields) {
            if (error) {
                console.log(error);
            }
            res.send({
                status: "success",
                msg: "Recorded updated."
            });

        });
});

// Database update.
// Gets meet-up request answer from client side
app.post('/updateIncoming', function (req, res) {
    res.setHeader('Content-Type', 'application/json');

    // Updates row to meet table with acceptation selection
    connection.query('UPDATE meet SET accepted = ?, viewed = ? WHERE reqNum = ?',
        [parseInt(req.body.accepted), parseInt(req.body.viewed), parseInt(req.body.reqNum)],
        function (error, results, fields) {
            if (error) {
                console.log(error);
            }
            res.send({
                status: "success",
                msg: "Recorded updated."
            });
        });
});

// Database update.
// Gets location reset from client side profile
app.post('/updateLocation', function (req, res) {
    res.setHeader('Content-Type', 'application/json');

    // Updates row from users to input new location of user
    connection.query('UPDATE bby14_users SET latitude = ?, longitude = ? WHERE ID = ?',
        [req.body.latitude, req.body.longitude, req.session.identity],
        function (error, results, fields) {
            if (error) {
                console.log(error);
            }
            res.send({
                status: "success",
                msg: "Recorded updated."
            });
        });
});

// Database update.
// Gets profile input info from client side
app.post('/updateUser', function (req, res) {
    res.setHeader('Content-Type', 'application/json');

    // Updates the user row in users with new client info
    connection.query('UPDATE bby14_users SET email = ? , password = ?, first_name = ?, last_name = ?, age = ?, bio = ?, hobbies = ? WHERE ID = ?',
        [req.body.email, req.body.password, req.body.first_name, req.body.last_name, req.body.age, req.body.bio, req.body.hobbies, req.session.identity],
        function (error, results, fields) {
            if (error) {
                console.log(error);
            }
            res.send({
                status: "success",
                msg: "Recorded updated."
            });

            // Selects user row from newly updated table
            const loginInfo = `USE ${dbName}; SELECT * FROM bby14_users WHERE email = '${req.body.email}' AND password = '${req.body.password}';`;
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
                    // Renews session variables for future use
                    let validUserInfo = results[1][0];
                    req.session.loggedIn = true;
                    req.session.email = validUserInfo.email;
                    req.session.first_name = validUserInfo.first_name;
                    req.session.last_name = validUserInfo.last_name;
                    req.session.password = validUserInfo.password;
                    req.session.identity = validUserInfo.ID;
                    req.session.longitude = validUserInfo.longitude;
                    req.session.latitude = validUserInfo.latitude;
                    req.session.age = validUserInfo.age;
                    req.session.bio = validUserInfo.bio;
                    req.session.hobbies = validUserInfo.hobbies;
                    req.session.userType = validUserInfo.is_admin;
                    req.session.save(function (err) {
                        // session saved. for analytics we could record this in db
                    });
                }
            });
        });
});

// Database update.
// Gets new posts description from client side
app.post('/updateTimeline', function (req, res) {
    res.setHeader('Content-Type', 'application/json');

    // Updates row containing old post and inserts new description
    connection.query(`UPDATE posts SET posts = ? WHERE userID = ? AND postNum = ?`,
        [req.body.posts, req.session.identity, req.body.postNum],
        function (error, results, fields) {
            if (error) {
                console.log(error);
            }
            res.send({
                status: "success",
                msg: "Recorded updated."
            });

        });
});

// Database update.
// Gets admin users info from client side
app.post('/updateAdmin', function (req, res) {
    res.setHeader('Content-Type', 'application/json');

    // Updates user info by taking from input via admin
    connection.query('UPDATE bby14_users SET email = ? , password = ?, first_name = ?, last_name = ?, is_admin = ? WHERE ID = ?',
        [req.body.email, req.body.password, req.body.first_name, req.body.last_name, req.body.is_admin, req.body.id],
        function (error, results, fields) {
            if (error) {
                console.log(error);
            }
            res.send({
                status: "success",
                msg: "Recorded updated."
            });

        });
});

// Database delete.
// Gets account creation registration from client side
app.post('/deleteAdmin', function (req, res) {
    res.setHeader('Content-Type', 'application/json');

    connection.query('DELETE FROM bby14_users WHERE ID = ?',
        [req.body.id],
        function (error, results, fields) {
            if (error) {
                console.log(error);
            }
            res.send({
                status: "success",
                msg: "Recorded updated."
            });

        });
});


// Session redirect.
// Redirects user to admin user list if logged in, to login if not
app.get("/admin-users", function (req, res) {
    if (req.session.loggedIn) {
        let profile = fs.readFileSync("./app/html/adminUsers.html", "utf8");
        let profileDOM = new JSDOM(profile);

        // Selects all users from database
        connection.query(
            "SELECT * FROM bby14_users",
            function (error, results, fields) {
                if (error) {
                    console.log(error);
                }

                // Creates div html element fron dynamic user card insertion
                const usersProfiles = profileDOM.window.document.createElement("div");
                const createButton = profileDOM.window.document.createElement("div");
                let create = "<a href='/register'><button class='option' id='create1'>Create User</button></a><br><a><button id='edit' class='option'>Edit Users</button></a>";
                profileDOM.window.document.getElementById("create").appendChild(createButton);
                usersProfiles.innerHTML += create;
                let users;

                // Populates cards using user info
                for (let i = 0; i < results.length; i++) {
                    users =
                        '<div class="card">' +
                        '<div class="can">' +
                        '<p style="text-decoration: underline;">ID</p>' +
                        '<p>' + results[i].ID + '</p>' +
                        '<p style="text-decoration: underline;">First Name</p>' +
                        '<input class="inputs" type="text" id="firstNameInput' + results[i].ID + '" placeholder="e.g. John" value="' + results[i].first_name + '" readonly>' +
                        '<p style="text-decoration: underline;">Last Name</p>' +
                        '<input class="inputs" type="text" id="lastNameInput' + results[i].ID + '" placeholder="e.g. Smith" value="' + results[i].last_name + '" readonly>' +
                        '<p style="text-decoration: underline;">Email</p>' +
                        '<input class="inputs" type="text" id="emailInput' + results[i].ID + '" placeholder="e.g. bob@gmail.com" value="' + results[i].email + '" readonly>' +
                        '<p style="text-decoration: underline;">Password</p>' +
                        '<input class="inputs" type="text" id="passwordInput' + results[i].ID + '" placeholder="" value="' + results[i].password + '" readonly>' +
                        '<p style="text-decoration: underline;">Admin</p>' +
                        '<input class="inputs" type="number" id="adminInput' + results[i].ID + '" placeholder="0 for user/1 for admin" min="0" max="1" value="' + results[i].is_admin + '" readonly>' +
                        '</div>' +
                        '<div id="options">' +
                        '<a target="' + results[i].ID + '" class="option submit">Save</a>' +
                        '<a target="' + results[i].ID + '" class="option delete">Delete</a>' +
                        '</div>' +
                        '</div>';
                    usersProfiles.innerHTML += users;
                }
                profileDOM.window.document.getElementById("user_table").appendChild(usersProfiles);

                // Will fetch skeleton nav and footer and assign page title
                let navBar = fs.readFileSync("./app/html/nav.html", "utf8");
                let navBarDOM = new JSDOM(navBar);
                let string = `Users`;
                let t = navBarDOM.window.document.createTextNode(string);
                navBarDOM.window.document.querySelector("#welcome").appendChild(t);
                profileDOM.window.document.querySelector("#header").innerHTML = navBarDOM.window.document.querySelector("#header").innerHTML;
                res.send(profileDOM.serialize());
            }
        );
    } else {
        let doc = fs.readFileSync("./app/html/login.html", "utf8");
        res.send(doc);
    }
})

// Session redirect.
// Redirects user to friend finder page if logged in, to login if not
app.get("/friendFinder", function (req, res) {
    if (req.session.loggedIn) {
        let profile = fs.readFileSync("./app/html/friendFinder.html", "utf8");
        let profileDOM = new JSDOM(profile);
        let userProfilePics = [];

        // Selects all photos from database
        connection.query('SELECT * FROM userphotos;',
            function (error, results, fields) {
                if (error)
                    throw error;

                // Appends photos to list
                for (let i = 0; i < results.length; i++) {
                    userProfilePics[i] = results[i];
                }

                // Selects all friends where user is in relationship
                connection.query('SELECT * FROM friends WHERE user = ?;',
                    req.session.identity,
                    function (error, results, fields) {
                        if (error) {
                            console.log(error);
                        }

                        // Appends friend to list if same ID
                        for (let i = 0; i < results.length; i++) {
                            if (results[i].user == req.session.identity) {
                                listFriends[listFriends.length] = results[i];
                            }
                        }

                        // Selects all users from database
                        connection.query(
                            "SELECT * FROM bby14_users;",
                            function (error, results, fields) {
                                if (error) {
                                    console.log(error);
                                }

                                // Place class to hold distance from logged in user to other friends
                                class Place {
                                    constructor(ID, distance) {
                                        this.ID = ID;
                                        this.distance = distance;
                                    }

                                    getId() {
                                        return this.ID;
                                    }

                                    getDistance() {
                                        return this.distance;
                                    }
                                }

                                // Compare function to sort by distance from friends list
                                function compare(a, b) {
                                    if (a.distance < b.distance) {
                                        return -1;
                                    }
                                    if (a.distance > b.distance) {
                                        return 1;
                                    }
                                    return 0;
                                }

                                // Checks if friends recipient of relationship if in object then appends to list
                                function checkIfIn(object) {
                                    let num = 1;
                                    for (let i = 0; i < listFriends.length; i++) {
                                        if (object.ID == listFriends[i].friend) {
                                            num = 0;
                                        }
                                    }
                                    return num;
                                }

                                // Calculates distance between users using trigonometry
                                // Then stores in Place object for holding
                                let places = [];
                                for (let i = 0; i < results.length; i++) {
                                    if (results[i].ID != req.session.identity && checkIfIn(results[i])) {
                                        const first = req.session.latitude * Math.PI / 180;
                                        const second = results[i].latitude * Math.PI / 180;
                                        const mid = (results[i].longitude - req.session.longitude) * Math.PI / 180;
                                        const R = 6371;
                                        let distance = Math.acos(Math.sin(first) * Math.sin(second) + Math.cos(first) * Math.cos(second) * Math.cos(mid)) * R;
                                        const place = new Place(results[i].ID, distance);
                                        places[i] = place;
                                    }
                                }
                                
                                // Sort and filter list of friends and distances
                                places.sort(compare);
                                places = places.filter(function (e) {
                                    return e != null;
                                })

                                // Appends final friend results to list if ID's match
                                let newResults = [];
                                for (let f = 0; f < places.length; f++) {
                                    for (let k = 0; k < results.length; k++) {
                                        if (places[f].getId() == results[k].ID) {
                                            newResults[newResults.length] = results[k];
                                        }
                                    }
                                }

                                // Creates div html element for dynamic card insertion
                                const usersProfiles = profileDOM.window.document.createElement("div");
                                let users;

                                // Goes through all nearby, unfriended users
                                for (let i = 0; i < newResults.length; i++) {
                                    let age = (newResults[i].age ? '<p>' + newResults[i].age + '</p>' : '<p>Age not listed</p>');
                                    users =
                                        '<div class="card">' +
                                        '<div class="name">' +
                                        '<p class="head" >Name</p>' +
                                        '<p>' + newResults[i].first_name + ' ' + newResults[i].last_name + '</p>' +
                                        '</div>' +
                                        '<div class="age">' +
                                        '<p class="head" >Age</p>' +
                                        age +
                                        '</div>' +
                                        '<div class="img">' +
                                        '<img src="./avatar/avatar_' + newResults[i].ID + '.jpg">' +
                                        '</div>' +
                                        '<div class="bio">' +
                                        '<p class="head" >Bio</p>';

                                    // Checks if bio is null then displays message depending on result    
                                    if (newResults[i].bio != null) {
                                        users += '<p>' + newResults[i].bio + '</p>';
                                    } else {
                                        users += '<p>No bio listed</p>';
                                    }
                                    users +=
                                        '</div>' +
                                        '<div class="hobbies">' +
                                        '<p class="head" >Hobbies</p>';

                                    // Checks if bio is null then displays message depending on result    
                                    if (newResults[i].hobbies != null) {
                                        users += '<p>' + newResults[i].hobbies + '</p>';
                                    } else {
                                        users += '<p>No hobbies listed</p>'
                                    }
                                    users += '</div>'
                                    users += '<div class="distance">' +
                                        '<p class="head" >Distance</p>' +
                                        '<p>';

                                    // Inputs distance of each friend using Place object variables and methods    
                                    for (let k = 0; k < places.length; k++) {
                                        if (places[k].getId() == newResults[i].ID) {
                                            users += (places[k].getDistance()).toFixed(1) + 'km away';
                                        }
                                    }
                                    users += '</p>' +
                                        '</div>' +
                                        '<div class="button">' +
                                        '<a target="' + newResults[i].ID + '" class="option add">Add Friend</a>' +
                                        '</div>' +
                                        '</div>';
                                    usersProfiles.innerHTML += users;
                                }

                                // If friend options are 0 then replace with message
                                if (places.length == 0) {
                                    users = '<p id="alone">No users to be added.</p>';
                                    usersProfiles.innerHTML += users;
                                }
                                profileDOM.window.document.getElementById("user_table").appendChild(usersProfiles);

                                // Will fetch skeleton nav and footer and assign page title
                                let navBar = fs.readFileSync("./app/html/nav.html", "utf8");
                                let navBarDOM = new JSDOM(navBar);
                                let string = `Nearby`;
                                let t = navBarDOM.window.document.createTextNode(string);
                                navBarDOM.window.document.querySelector("#welcome").appendChild(t);
                                profileDOM.window.document.querySelector("#header").innerHTML = navBarDOM.window.document.querySelector("#header").innerHTML;
                                res.send(profileDOM.serialize());
                            }
                        );
                    });
            });
    } else {
        let doc = fs.readFileSync("./app/html/login.html", "utf8");
        res.send(doc);
    }
})

app.post('/updateFriends', function (req, res) {
    res.setHeader('Content-Type', 'application/json');

    connection.query('INSERT INTO Friends VALUES (?, ?)',
        [req.session.identity, req.body.id],
        function (error, results, fields) {
            if (error) {
                console.log(error);
            }
            res.send({
                status: "success",
                msg: "Recorded updated."
            });

        });
});



app.get("/main", function (req, res) {

    if (req.session.loggedIn) {
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



// host: dbHost,
// user: dbUser,
// password: "",
// database: dbName,
// multipleStatements: "true"

let chatUser;
app.post("/login", function (req, res) {
    res.setHeader("Content-Type", "application/json");

    // Checks if user typed in matching email and password
    const loginInfo = `USE ${dbName}; SELECT * FROM bby14_users WHERE email = '${req.body.email}' AND password = '${req.body.password}';`;

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
            req.session.first_name = validUserInfo.first_name;
            req.session.last_name = validUserInfo.last_name;
            req.session.password = validUserInfo.password;
            req.session.identity = validUserInfo.ID;
            req.session.longitude = validUserInfo.longitude;
            req.session.latitude = validUserInfo.latitude;
            req.session.age = validUserInfo.age;
            req.session.bio = validUserInfo.bio;
            req.session.hobbies = validUserInfo.hobbies;
            req.session.userType = validUserInfo.is_admin;
            chatUser = req.session.first_name;

            req.session.save(function (err) {
                // session saved. for analytics we could record this in db
            })
            console.log(req.session.identity);
            res.send({ status: "success", msg: "Logged in." });
        }
    })
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



// Code to upload an image.
// Adapted from Mutler and COMP 2537 example.
// start of upload-app.js

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, "./app/avatar/")
    },
    filename: function (req, file, callback) {
        // // callback(null, "avatar_" + file.originalname.split('/').pop().trim());
        const sessionID = "" + req.session.identity;
        // callback(null, "avatar_" + sessionID + "." + file.originalname.split(".").pop());
        callback(null, "avatar_" + sessionID + ".jpg");
    }
});

const upload = multer({ storage: storage });

// code to store images as posts for users. 
const postStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, "./app/posts/")
    },
    filename: function (req, file, callback) {
        let count = 0;
        callback(null, "posts_" + count++ + ".jpg");
    }
});

const uploadPostImages = multer({
    storage: postStorage
});





app.get('/', function (req, res) {
    let doc = fs.readFileSync('./app/html/index.html', "utf8");
    res.send(doc);

});



app.post('/upload-images', upload.array("files"), function (req, res) {

    for (let i = 0; i < req.files.length; i++) {
        req.files[i].filename = req.files[i].originalname;
    }

    if (!req.files[0].filename) {
        console.log("No file upload");
    } else {

        let imgsrc = "avatar_" + req.session.identity + "." + req.files[0].originalname.split(".").pop();
        let updateData = `DELETE FROM userphotos WHERE userID = ${req.session.identity}; INSERT INTO userphotos (userID, imageID) VALUES (?, ?);`

        connection.query(updateData, [req.session.identity, imgsrc], function (err, result) {

            if (err) throw err
            console.log("file uploaded")
        })
    }
});



// end of upload-app.js



app.post('/upload-post-images', uploadPostImages.array("files"), function (req, res) {
    if (req.files.length > 0) {
        for (let i = 0; i < req.files.length; i++) {
            req.files[i].filename = req.files[i].originalname;

            connection.query('INSERT INTO postphotos (userID, imageID) VALUES (?, ?)',
                [req.session.identity, imgPath],
                function (error, results, fields) {

                });
        }
        res.send({
            status: "success",
            msg: "Image information added to database."
        });
        req.session.save(function (err) { });
    } else {
        connection.query('INSERT INTO postphotos (userID, imageID) VALUES (?, ?)',
            [req.session.identity, null],
            function (error, results, fields) { });
        res.send({
            status: "success",
            msg: "No image has been uploaded"
        });
        req.session.save(function (err) { });
    }
});



/**
 * Global live chat room.
 * Block of code adapted from Youtube tutorials.
 * 
 * @author Web Dev Simplified
 * @see https://www.youtube.com/watch?v=ZKEqqIO7n-k
 * @see https://www.youtube.com/watch?v=rxzOqP9YwmM
 * @author Traversy Media
 * @see https://www.youtube.com/watch?v=jD7FnbI76Hg
 */

const botName = 'Gabify Bot';

// Run when client connects
io.on('connection', socket => {
    socket.on('joinRoomG', ({ username, room }) => {
        const user = userJoin(socket.id, username, room);

        socket.join(user.room);

        // Welcome current user
        socket.emit('messageG', formatMessage(botName, 'Welcome to Gabify Chat!'));

        // Broadcast when a user connects
        socket.broadcast
            .to(user.room)
            .emit(
                'messageG',
                formatMessage(botName, `${user.username} has joined the chat!`)
            );

        // Send users and room info
        io.to(user.room).emit('roomUsersG', {
            room: user.room,
            users: getRoomUsers(user.room)
        });
    });

    // Listen for chatMessage
    socket.on('chatMessageG', msg => {
        const user = getCurrentUser(socket.id);

        io.to(user.room).emit('messageG', formatMessage(user.username, msg));
    });

    // Runs when client disconnects
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);

        if (user) {
            io.to(user.room).emit(
                'messageG',
                formatMessage(botName, `${user.username} has left the chat!`)
            );

            // Send users and room info
            io.to(user.room).emit('roomUsersG', {
                room: user.room,
                users: getRoomUsers(user.room)
            });
        }
    });
});

app.get("/chatGlobalSelect", function (req, res) {
    if (req.session.loggedIn) {
        let profile = fs.readFileSync("./app/html/chatGlobalSelect.html", "utf8");
        let profileDOM = new JSDOM(profile);
        let navBar = fs.readFileSync("./app/html/nav.html", "utf8");
        let navBarDOM = new JSDOM(navBar);
        let string = `Chat`;
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

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));


// code for one-to-one chat; work in progress
io.on('connection', socket => {
    socket.on('joinRoom', ({ chatUser }) => {
        const user = newUser(socket.id, chatUser);

        socket.join(user.room);

        // General welcome
        socket.emit('message', formatMessage("GabChat", 'Chat messages will be erased upon log out'));

        // Broadcast everytime users connects
        socket.broadcast
            .to(user.room)
            .emit(
                'message',
                formatMessage("GabChat", 'Your friend has joined the room')
            );

        // Current active users and room name
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getIndividualRoomUsers(user.room)
        });
    });

    // Listen for client message
    socket.on('chatMessage', msg => {
        const user = getActiveUser(socket.id);

        io.to(user.room).emit('message', formatMessage(chatUser, msg));
    });

    // Runs when client disconnects
    socket.on('disconnect', () => {
        const user = exitRoom(socket.id);

        if (user) {
            io.to(user.room).emit(
                'message',
                formatMessage("GabChat", `${chatUser} has left the room`)
            );

            // Current active users and room name
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getIndividualRoomUsers(user.room)
            });
        }
    });
});

app.get("/gabChat", function (req, res) {
    if (req.session.loggedIn) {
        let profile = fs.readFileSync("./app/html/gabChat.html", "utf8");
        let profileDOM = new JSDOM(profile);

        res.send(profileDOM.serialize());
    }
    else {
        let doc = fs.readFileSync("./app/html/login.html", "utf8");
        res.send(doc);
    }
});















// app.set('port', process.env.PORT || 3000);
// server.listen(app.get('port'));









// //For Milestone hand-ins:
// let port = 8000;
// app.listen(port, function () {
// });

//For Heroku deployment
// app.listen(process.env.PORT || 3000);

