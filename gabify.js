"use strict";
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
// const server = http.createServer(app);
// const { Server } = require("socket.io");
// const io = new Server(server);
const server = http.createServer(app);
const io = socketio(server);
const formatMessage = require('./helpers/formatDate')

let seshUser;

const {
    getActiveUser,
    exitRoom,
    newUser,
    getIndividualRoomUsers
} = require('./helpers/userHelper');

// const server = http.createServer(app);
// const io = socketio(server);

const {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
} = require('./helpers/users');


app.use("/html", express.static("./app/html"));
app.use("/avatar", express.static("./app/avatar"));
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


app.get("/", function (req, res) {
    if (req.session.loggedIn) {
        res.redirect("/main");
    } else {
        let doc = fs.readFileSync("./app/html/login.html", "utf8");
        res.send(doc);
    }
});

app.get("/register", function (req, res) {
        let profile = fs.readFileSync("./app/html/register.html", "utf8");
        let profileDOM = new JSDOM(profile);
        res.send(profileDOM.serialize());
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

app.get("/timeline", function (req, res) {
    if (req.session.loggedIn) {
        let profile = fs.readFileSync("./app/html/timeline.html", "utf8");
        let profileDOM = new JSDOM(profile);

        connection.query(
            "SELECT * FROM posts ORDER BY postDate DESC",
            function (error, results, fields) {
                if (error) {
                    console.log(error);
                }

                let newResults = [];
                for (let i = 0; i < results.length; i++) {
                    if (results[i].userID == req.session.identity) {
                        newResults[newResults.length] = results[i];
                    }
                }
                const usersProfiles = profileDOM.window.document.createElement("div");
                // const createButton = profileDOM.window.document.createElement("div");
                // let create = "<a href=''><button class='option'>Add Memory</button></a>";
                // profileDOM.window.document.getElementById("create").appendChild(createButton);
                // usersProfiles.innerHTML += create;
                let users;
                var old = "";
                // var upload_image = `<form id="upload-images-form" action="/" method="post">
                //                     <input id="image-upload" type="file" value="Upload Image" 
                //                     accept="image/png, image/gif, image/jpeg" multiple="multiple" />
                //                     <input id="submit2" type="submit" class="option" value="Upload photo" />
                //                     </form>`

                for (let i = 0; i < newResults.length; i++) {
                    let dob = newResults[i].postDate
                    var dobArr = dob.toDateString().split(' ');
                    var dobFormat = dobArr[1] + ' ' + dobArr[2] + ', ' + dobArr[3];
                    if (dobFormat.localeCompare(old) != 0) {
                        old = dobFormat;
                        users = '<h2>' + dobFormat + '</h2>';
                        usersProfiles.innerHTML += users;
                    }
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
                let string = `Timeline`;
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

app.get("/request", function (req, res) {
    if (req.session.loggedIn) {
        let profile = fs.readFileSync("./app/html/request.html", "utf8");
        let profileDOM = new JSDOM(profile);

        let listUsers = [];

        connection.query('SELECT * FROM bby14_users;',
            function (error, results, fields) {
                if (error) {
                    console.log(error);
                }

                for (let i = 0; i < results.length; i++) {
                    listUsers[listUsers.length] = results[i];
                }

                connection.query(
                    "SELECT * FROM friends;",
                    function (error, results, fields) {
                        if (error) {
                            console.log(error);
                        }
                        console.log(req.session.identity);
                        let listFriends = [];
                        for (let i = 0; i < results.length; i++) {
                            if (results[i].user == req.session.identity) {
                                listFriends[listFriends.length] = results[i];
                            }
                        }
                        let friends = [];
                        for (let i = 0; i < listFriends.length; i++) {
                            for (let k = 0; k < results.length; k++) {
                                if (listFriends[i].friend == results[k].user & results[k].friend == listFriends[i].user) {
                                    friends[friends.length] = listFriends[i];
                                }
                            }
                        }
                        friends = friends.filter(function (e) {
                            return e != null;
                        })
        
                        let finalUsers = [];
        
                        for (let i = 0; i < friends.length; i++) {
                            for (let k = 0; k < listUsers.length; k++) {
                                if (friends[i].friend == listUsers[k].ID) {
                                    finalUsers[finalUsers.length] = listUsers[k];
                                }
                            }
                        }
                        const usersProfiles = profileDOM.window.document.createElement("div");
                        let users;
                        users =
                            '<div id="drop">' +
                            '<div class="card2">' +
                            '<div class="can">' +
                            '<p style="text-decoration: underline;">Choose Friend</p>' +
                            '<select type="date" id="personInput" placeholder="Select Friend">';
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

app.get("/schedule", function (req, res) {
    if (req.session.loggedIn) {
        let profile = fs.readFileSync("./app/html/schedule.html", "utf8");
        let profileDOM = new JSDOM(profile);

        let listUsers = [];

        connection.query('SELECT * FROM bby14_users;',
            function (error, results, fields) {
                if (error) {
                    console.log(error);
                }

                for (let i = 0; i < results.length; i++) {
                    listUsers[listUsers.length] = results[i];
                }

                connection.query(
                    "SELECT * FROM meet ORDER BY date ASC;",
                    function (error, results, fields) {
                        if (error) {
                            console.log(error);
                        }
                        let newResults = []
        
                        for (let i = 0; i < results.length; i++) {
                            if ((results[i].requestee == req.session.identity || results[i].requestor == req.session.identity) && results[i].viewed == 1 & results[i].accepted == 1) {
                                newResults[newResults.length] = results[i];
                            }
                        }
        
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

app.get("/incoming", function (req, res) {
    if (req.session.loggedIn) {
        let profile = fs.readFileSync("./app/html/incoming.html", "utf8");
        let profileDOM = new JSDOM(profile);

        let listUsers = [];

        connection.query('SELECT * FROM bby14_users;',
            function (error, results, fields) {
                if (error) {
                    console.log(error);
                }

                for (let i = 0; i < results.length; i++) {
                    listUsers[listUsers.length] = results[i];
                }

                connection.query(
                    "SELECT * FROM meet ORDER BY date ASC;",
                    function (error, results, fields) {
                        if (error) {
                            console.log(error);
                        }
                        let newResults = []
        
                        for (let i = 0; i < results.length; i++) {
                            if (results[i].requestee == req.session.identity && results[i].viewed == 0) {
                                newResults[newResults.length] = results[i];
                            }
                        }
        
                        const usersProfiles = profileDOM.window.document.createElement("div");
                        let users;
                        for (let i = 0; i < newResults.length; i++) {
                            users =
                                '<div id="drop">' +
                                '<div class="card2">' +
                                '<div class="can">' +
                                '<h2>Meet-up Request</h2>' +
                                '<p style="text-decoration: underline;">Who</p>' +
                                '<p>';
                            for (let k = 0; k < listUsers.length; k++) {
                                if (newResults[i].requestor == listUsers[k].ID) {
                                    users += listUsers[k].first_name + ' ' + listUsers[k].last_name;
                                }
                            }
                            users +=
                                '</p>' +
                                '<p style="text-decoration: underline;">When</p>' +
                                '<p>' + newResults[i].date + '</p>' +
                                '<p style="text-decoration: underline;">Where</p>' +
                                '<p>' + newResults[i].place + '</p>' +
                                '<p style="text-decoration: underline;">Occasion</p>' +
                                '<p>' + newResults[i].reason + '</p>' +
                                '<a id="accept" target="' + newResults[i].reqNum + '" class="option">Accept</a>' +
                                '<a id="decline" target="' + newResults[i].reqNum + '" class="option">Decline</a>' +
                                '</div>' +
                                '</div>' +
                                '</div>';
                            usersProfiles.innerHTML += users;
                        }
        
        
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


app.get("/contact", async function (req, res) {
    if (req.session.loggedIn) {
        let profile = fs.readFileSync("./app/html/contact.html", "utf8");
        let profileDOM = new JSDOM(profile);

        let listUsers = [];

        connection.query('SELECT * FROM bby14_users;',
            function (error, results, fields) {
                if (error) {
                    console.log(error);
                }

                for (let i = 0; i < results.length; i++) {
                    listUsers[listUsers.length] = results[i];
                }

                connection.query(
                    "SELECT * FROM friends;",
                    function (error, results, fields) {
                        if (error) {
                            console.log(error);
                        }
                        console.log(req.session.identity);
                        let listFriends = [];
                        for (let i = 0; i < results.length; i++) {
                            if (results[i].user == req.session.identity) {
                                listFriends[listFriends.length] = results[i];
                            }
                        }
                        let friends = [];
                        for (let i = 0; i < listFriends.length; i++) {
                            for (let k = 0; k < results.length; k++) {
                                if (listFriends[i].friend == results[k].user & results[k].friend == listFriends[i].user) {
                                    friends[friends.length] = listFriends[i];
                                }
                            }
                        }
                        friends = friends.filter(function (e) {
                            return e != null;
                        })
        
                        let finalUsers = [];
        
                        for (let i = 0; i < friends.length; i++) {
                            for (let k = 0; k < listUsers.length; k++) {
                                if (friends[i].friend == listUsers[k].ID) {
                                    finalUsers[finalUsers.length] = listUsers[k];
                                }
                            }
                        }
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
                                // imageProf +
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

app.get("/userProfiles", function (req, res) {
    if (req.session.loggedIn) {


        let profile = fs.readFileSync("./app/html/userProfiles.html", "utf8");
        let profileDOM = new JSDOM(profile);

        let navBar = fs.readFileSync("./app/html/nav.html", "utf8");
        let navBarDOM = new JSDOM(navBar);
        let string = `Profile`;
        let t = navBarDOM.window.document.createTextNode(string);
        navBarDOM.window.document.querySelector("#welcome").appendChild(t);
        profileDOM.window.document.querySelector("#emailInput").setAttribute('value', req.session.email);
        profileDOM.window.document.querySelector("#passwordInput").setAttribute('value', req.session.password);
        profileDOM.window.document.querySelector("#firstNameInput").setAttribute('value', req.session.first_name);
        profileDOM.window.document.querySelector("#lastNameInput").setAttribute('value', req.session.last_name);
        if (req.session.age != null) {
            profileDOM.window.document.querySelector("#ageInput").setAttribute('value', req.session.age);
        }
        if (req.session.hobbies != null) {
            profileDOM.window.document.querySelector("#hobbiesInput").setAttribute('value', req.session.hobbies);
        }
        profileDOM.window.document.querySelector("#header").innerHTML = navBarDOM.window.document.querySelector("#header").innerHTML;
        const usersProfiles = profileDOM.window.document.createElement("div");
        if (req.session.bio != null) {
            usersProfiles.innerHTML = '<textarea rows="4" id="bioInput" value="" type="text" required="required" maxlength="100" placeholder="Tell us about yourself!">' + req.session.bio + '</textarea>';
        } else {
            usersProfiles.innerHTML = '<textarea rows="4" id="bioInput" value="" type="text" required="required" maxlength="100" placeholder="Tell us about yourself!"></textarea>';
        }
        profileDOM.window.document.getElementById("bio").appendChild(usersProfiles);

        let img = profileDOM.window.document.querySelector('#avatar');
        img.src = './avatar/avatar_' + req.session.identity + '.jpg';


        connection.query(`SELECT * FROM posts WHERE userID = ${req.session.identity}`,
            function (error, results, fields) {
                if (error) {
                    console.log(error);
                }
                const userPosts = profileDOM.window.document.createElement("div");
                for (let i = 0; i < results.length; i++) {
                    let posts =
                        '<div class="card">' +
                        '<div class="can">' +
                        '<p style="text-decoration: underline;">' +
                        'Post' + results[i].postNum + '</p>' +
                        '<p>' + results[i].posts + '</p>' +
                        '<p>' + results[i].postDate + '</p>' +
                        '<p>' + results[i].postTime + '</p>' +
                        '</div>' +
                        '</div>';
                    userPosts.innerHTML += posts;
                }


                profileDOM.window.document.getElementById("timeline").innerHTML += userPosts;

            });

        // let imageURL;
        // database.query(`SELECT * FROM userphotos WHERE userID = ${req.session.identity}`,
        // function(error,results, fields) {
        //     if (error)
        //         throw error;
        //     if (results.length > 0) {
        //         imageURL = './avatar/avatar_' + req.session.identity + '.jpg';
        //     } else {
        //         imageURL = './avatar/placeholder.jpg';
        //     }
        //     img.src = imageURL;
        // });

        res.send(profileDOM.serialize());
    }
    else {
        let doc = fs.readFileSync("./app/html/login.html", "utf8");
        res.send(doc);
    }
});

app.post('/addRequest', function (req, res) {
    res.setHeader('Content-Type', 'application/json');

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


app.post('/create', function (req, res) {
    res.setHeader('Content-Type', 'application/json');

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

app.post('/addTimeline', function (req, res) {
    res.setHeader('Content-Type', 'application/json');

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

app.post('/updateIncoming', function (req, res) {
    res.setHeader('Content-Type', 'application/json');

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

app.post('/updateLocation', function (req, res) {
    res.setHeader('Content-Type', 'application/json');

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

app.post('/updateUser', function (req, res) {
    res.setHeader('Content-Type', 'application/json');

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
        
                    req.session.save(function (err) {
                        // session saved. for analytics we could record this in db
                    });
                }
            });

        });

});

app.post('/updateTimeline', function (req, res) {
    res.setHeader('Content-Type', 'application/json');

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

app.post('/updateAdmin', function (req, res) {
    res.setHeader('Content-Type', 'application/json');

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



app.get("/admin-users", function (req, res) {
    if (req.session.loggedIn) {
        let profile = fs.readFileSync("./app/html/adminUsers.html", "utf8");
        let profileDOM = new JSDOM(profile);

        connection.query(
            "SELECT * FROM bby14_users",
            function (error, results, fields) {
                if (error) {
                    console.log(error);
                }

                const usersProfiles = profileDOM.window.document.createElement("div");
                const createButton = profileDOM.window.document.createElement("div");
                let create = "<a href='/register'><button class='option' id='create1'>Create User</button></a><br><a><button id='edit' class='option'>Edit Users</button></a>";
                profileDOM.window.document.getElementById("create").appendChild(createButton);
                usersProfiles.innerHTML += create;
                let users;

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

app.get("/friendFinder", function (req, res) {
    if (req.session.loggedIn) {
        let profile = fs.readFileSync("./app/html/friendFinder.html", "utf8");
        let profileDOM = new JSDOM(profile);

        let userProfilePics = [];

        connection.query('SELECT * FROM userphotos;',
            function (error, results, fields) {
                if (error)
                    throw error;
                for (let i = 0; i < results.length; i++) {
                    userProfilePics[i] = results[i];
                    console.log(userProfilePics[i].userID);
                }

                connection.query('SELECT * FROM friends WHERE user = ?;',
                    req.session.identity,
                    function (error, results, fields) {
                        if (error) {
                            console.log(error);
                        }

                        for (let i = 0; i < results.length; i++) {
                            if (results[i].user == req.session.identity) {
                                listFriends[listFriends.length] = results[i];
                            }
                        }

                        connection.query(
                            "SELECT * FROM bby14_users;",
                            function (error, results, fields) {
                                if (error) {
                                    console.log(error);
                                }
                
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
                
                                let places = [];
                
                                function compare(a, b) {
                                    if (a.distance < b.distance) {
                                        return -1;
                                    }
                                    if (a.distance > b.distance) {
                                        return 1;
                                    }
                                    return 0;
                                }
                
                                function checkIfIn(object) {
                                    let num = 1;
                                    for (let i = 0; i < listFriends.length; i++) {
                                        if (object.ID == listFriends[i].friend) {
                                            num = 0;
                                        }
                                    }
                                    return num;
                                }
                
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
                                places.sort(compare);
                                places = places.filter(function (e) {
                                    return e != null;
                                })
                                let newResults = [];
                
                                for (let f = 0; f < places.length; f++) {
                                    for (let k = 0; k < results.length; k++) {
                                        if (places[f].getId() == results[k].ID) {
                                            newResults[newResults.length] = results[k];
                                        }
                                    }
                                }
                
                                const usersProfiles = profileDOM.window.document.createElement("div");
                                let users;
                
                                for (let i = 0; i < newResults.length; i++) {
                                    let age = (newResults[i].age ? '<p>' + newResults[i].age + '</p>' : '<p>Age not listed</p>');
                                    // let imageProf = (userProfilePics.indexOf(newResults[i].ID) !== -1 ? '<img src="./avatar/' + userProfilePics[i].imageID + '>' : '<img src="./avatar/placeholder.jpg">');
                
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
                                        // imageProf +
                                        '</div>' +
                                        '<div class="bio">' +
                                        '<p class="head" >Bio</p>';
                                    if (newResults[i].bio != null) {
                                        users += '<p>' + newResults[i].bio + '</p>';
                                    } else {
                                        users += '<p>No bio listed</p>';
                                    }
                                    users +=
                                        '</div>' +
                                        '<div class="hobbies">' +
                                        '<p class="head" >Hobbies</p>';
                                    if (newResults[i].hobbies != null) {
                                        users += '<p>' + newResults[i].hobbies + '</p>';
                                    } else {
                                        users += '<p>No hobbies listed</p>'
                                    }
                                    users += '</div>'
                                    users += '<div class="distance">' +
                                        '<p class="head" >Distance</p>' +
                                        '<p>';
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

                                if (places.length == 0) {
                                    users = '<p id="alone">No users to be added.</p>';
                                    usersProfiles.innerHTML += users;
                                }
                
                                profileDOM.window.document.getElementById("user_table").appendChild(usersProfiles);
                
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

        let listFriends = [];

        
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
            seshUser = req.session.first_name;

            req.session.save(function (err) {
                // session saved. for analytics we could record this in db
            })
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
                function (error, results, fields) { });
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
    socket.on('joinRoom', ({ seshUser, room }) => {
        const user = newUser(socket.id, seshUser, room);

        socket.join(user.room);

        // General welcome
        socket.emit('message', formatMessage("GabChat", 'Messages are limited to this room!'));

        // Broadcast everytime users connects
        socket.broadcast
            .to(user.room)
            .emit(
                'message',
                formatMessage("GabChat", `${user.seshUser} has joined the room`)
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

        io.to(user.room).emit('message', formatMessage(user.seshUser, msg));
    });

    // Runs when client disconnects
    socket.on('disconnect', () => {
        const user = exitRoom(socket.id);

        if (user) {
            io.to(user.room).emit(
                'message',
                formatMessage("WebCage", `${user.seshUser} has left the room`)
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
        // let navBar = fs.readFileSync("./app/html/nav.html", "utf8");
        // let navBarDOM = new JSDOM(navBar);
        // let string = `Chat`;
        // let t = navBarDOM.window.document.createTextNode(string);
        // navBarDOM.window.document.querySelector("#welcome").appendChild(t);
        // profileDOM.window.document.querySelector("#header").innerHTML = navBarDOM.window.document.querySelector("#header").innerHTML;

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

