// Code to do server side is adapted from a COMP 1537 assignment.
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

const bodyparser = require('body-parser');
const path = require('path');
const { connect } = require("http2");
const multer = require('multer');

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


const connection = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "passwordSQL",
    database: "comp2800",
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
    if (req.session.loggedIn) {
        let profile = fs.readFileSync("./app/html/register.html", "utf8");
        let profileDOM = new JSDOM(profile);
        res.send(profileDOM.serialize());
    } 
     else {
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

app.get("/meet", function (req, res) {
    if (req.session.loggedIn) {
        let profile = fs.readFileSync("./app/html/meet.html", "utf8");
        let profileDOM = new JSDOM(profile);

        let navBar = fs.readFileSync("./app/html/nav.html", "utf8");
        let navBarDOM = new JSDOM(navBar);
        let string = `Meet-up`;
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

app.get("/timeline", function (req, res) {
    if (req.session.loggedIn) {
        let profile = fs.readFileSync("./app/html/timeline.html", "utf8");
        let profileDOM = new JSDOM(profile);

        const mysql = require("mysql2");

        const connection = mysql.createConnection({
            host: "127.0.0.1",
            user: "root",
            password: "passwordSQL",
            database: "comp2800",
            multipleStatements: "true"
        });
        connection.connect();

        connection.query(
            "SELECT * FROM posts ORDER BY postDate ASC",
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
                        '<p style="text-decoration: underline;" value="' + newResults[i].postNum + '" id="numInput' + newResults[i].userID + '" >Memory #' + newResults[i].postNum + '</p>' +
                        '<p style="text-decoration: underline;">Descrition</p>' +
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


app.get("/contact", function (req, res) {
    if (req.session.loggedIn) {
        let profile = fs.readFileSync("./app/html/contact.html", "utf8");
        let profileDOM = new JSDOM(profile);

        const mysql = require("mysql2");

        const connection = mysql.createConnection({
            host: "127.0.0.1",
            user: "root",
            password: "passwordSQL",
            database: "comp2800",
            multipleStatements: "true"
        });
        connection.connect();

        let listUsers = [];

        connection.query('SELECT * FROM bby14_users;',
        function (error, results, fields) {
          if (error) {
            console.log(error);
          }

          for (let i = 0; i < results.length; i++) {
                listUsers[listUsers.length] = results[i];
            }
        });

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
                        '<div class="card">' +
                        '<div class="name">' +
                        '<p style="text-decoration: underline;">Name</p>' +
                        '<p>' + finalUsers[i].first_name + ' ' + finalUsers[i].last_name + '</p>' +
                        '</div>' +
                        '<div class="age">' +
                        '<p style="text-decoration: underline;">Age</p>' +
                        '<p>' + finalUsers[i].age + '</p>' +
                        '</div>' +
                        '<div class="img">' +
                        '<img src="/avatar/avatar_2.jpg">' +
                        '</div>' +
                        '<div class="bio">' +
                        '<p style="text-decoration: underline;">Bio</p>' +
                        '<p>' + finalUsers[i].bio + '</p>' +
                        '</div>' +
                        '<div class="hobbies">' +
                        '<p style="text-decoration: underline;">Hobbies</p>';
                        if (finalUsers[i].hobbies != null) {
                            users += '<p>' + finalUsers[i].hobbies +'</p>';
                        } else {
                            users += '<p>No hobbies listed</p>'
                        }
                        users += '</div>'
                        users += 
                        '<div class="button">' +
                        '<a target="' + finalUsers[i].ID + '" class="option add"><span class="material-symbols-outlined">sms</span>Chat</a>' +
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
        profileDOM.window.document.querySelector("#bioInput").setAttribute('value', req.session.bio);
        if (req.session.hobbies != null) {
            profileDOM.window.document.querySelector("#ageInput").setAttribute('value', req.session.hobbies);
        }        
        profileDOM.window.document.querySelector("#header").innerHTML = navBarDOM.window.document.querySelector("#header").innerHTML;

        const mysql3 = require("mysql2");

            const database = mysql3.createConnection({
                host: "127.0.0.1",
                user: "root",
                password: "passwordSQL",
                database: "comp2800",
                multipleStatements: "true"
                });
            database.connect();

        
        database.query(`SELECT * FROM posts WHERE userID = ${req.session.identity}`, 
        function (error, results, fields) {
            if (error) {
              console.log(error);
            }
            const userPosts = profileDOM.window.document.createElement("div");
            for(let i = 0; i < results.length; i++) {
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


        res.send(profileDOM.serialize());
    } 
     else {
        let doc = fs.readFileSync("./app/html/login.html", "utf8");
        res.send(doc);
    }
});


app.post('/create', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
  
    let connection = mysql.createConnection({
        host: "127.0.0.1",
        user: "root",
        password: "passwordSQL",
        database: "comp2800",
        multipleStatements: "true"
    });
    connection.connect();
    connection.query('INSERT INTO bby14_users VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [req.body.ID, req.body.first_name, req.body.last_name, req.body.email, req.body.password, req.body.latitude, req.body.longitude, null, null, null, 0],
      function (error, results, fields) {
        if (error) {
          console.log(error);
        }
        res.send({
          status: "success",
          msg: "Recorded updated."
        });
  
      });
    connection.end();
  
  });

  app.post('/addTimeline', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
  
    let connection = mysql.createConnection({
        host: "127.0.0.1",
        user: "root",
        password: "passwordSQL",
        database: "comp2800",
        multipleStatements: "true"
    });
    connection.connect();
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
    connection.end();
  
  });

app.post('/updateUser', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
  
    let connection = mysql.createConnection({
        host: "127.0.0.1",
        user: "root",
        password: "passwordSQL",
        database: "comp2800",
        multipleStatements: "true"
    });
    connection.connect();
    connection.query('UPDATE bby14_users SET email = ? , password = ?, first_name = ?, last_name = ?, latitude = ?, longitude = ?, age = ?, bio = ?, hobbies = ? WHERE ID = ?',
      [req.body.email, req.body.password, req.body.first_name, req.body.last_name, req.body.latitude, req.body.longitude, req.body.age, req.body.bio, req.body.hobbies, req.session.identity],
      function (error, results, fields) {
        if (error) {
          console.log(error);
        }
        res.send({
          status: "success",
          msg: "Recorded updated."
        });
      });

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
              })
          }
      })
    connection.end();

});

app.post('/updateTimeline', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
  
    let connection = mysql.createConnection({
        host: "127.0.0.1",
        user: "root",
        password: "passwordSQL",
        database: "comp2800",
        multipleStatements: "true"
    });
    connection.connect();
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
    connection.end();

});

app.post('/updateAdmin', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
  
    let connection = mysql.createConnection({
        host: "127.0.0.1",
        user: "root",
        password: "passwordSQL",
        database: "comp2800",
        multipleStatements: "true"
    });
    connection.connect();
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
    connection.end();

});

app.post('/deleteAdmin', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
  
    let connection = mysql.createConnection({
        host: "127.0.0.1",
        user: "root",
        password: "passwordSQL",
        database: "comp2800",
        multipleStatements: "true"
    });
    connection.connect();
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
    connection.end();

});

app.get("/admin-users", function (req, res) {
    if (req.session.loggedIn) {
        let profile = fs.readFileSync("./app/html/adminUsers.html", "utf8");
        let profileDOM = new JSDOM(profile);

        const mysql = require("mysql2");

        const connection = mysql.createConnection({
            host: "127.0.0.1",
            user: "root",
            password: "passwordSQL",
            database: "comp2800",
            multipleStatements: "true"
        });
        connection.connect();

        connection.query(
            "SELECT * FROM bby14_users",
            function (error, results, fields) {
                if (error) {
                    console.log(error);
                }

                const usersProfiles = profileDOM.window.document.createElement("div");
                const createButton = profileDOM.window.document.createElement("div");
                let create = "<a href='/register'><button class='option'>Create User</button></a>";
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
                        '<input type="text" id="firstNameInput' + results[i].ID + '" placeholder="e.g. John" value="' + results[i].first_name + '"></input>' +
                        '<p style="text-decoration: underline;">Last Name</p>' +
                        '<input type="text" id="lastNameInput' + results[i].ID + '" placeholder="e.g. Smith" value="' + results[i].last_name + '"></input>' +
                        '<p style="text-decoration: underline;">Email</p>' +
                        '<input type="text" id="emailInput' + results[i].ID + '" placeholder="e.g. bob@gmail.com" value="' + results[i].email + '"></input>' +
                        '<p style="text-decoration: underline;">Password</p>' +
                        '<input type="text" id="passwordInput' + results[i].ID + '" placeholder="" value="' + results[i].password + '"></input>' +
                        '<p style="text-decoration: underline;">Admin</p>' +
                        '<input type="number" id="adminInput' + results[i].ID + '" placeholder="0 for user/1 for admin" min="0" max="1" value="' + results[i].is_admin + '"></input>' +
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

        const mysql = require("mysql2");

        const connection = mysql.createConnection({
            host: "127.0.0.1",
            user: "root",
            password: "passwordSQL",
            database: "comp2800",
            multipleStatements: "true"
        });
        connection.connect();

        let listFriends = [];

        connection.query('SELECT * FROM friends;',
        function (error, results, fields) {
          if (error) {
            console.log(error);
          }

          for (let i = 0; i < results.length; i++) {
            if (results[i].user == req.session.identity) {
                listFriends[listFriends.length] = results[i];
            }
        }
        });

        connection.query(
            "SELECT * FROM bby14_users;",
            function (error, results, fields) {
                if (error) {
                    console.log(error);
                }

                class Place {
                    constructor(ID, distance){
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
                        const first = req.session.latitude * Math.PI/180; 
                        const second = results[i].latitude * Math.PI/180;
                        const mid = (results[i].longitude - req.session.longitude) * Math.PI/180;
                        const R = 6371;
                        let distance = Math.acos( Math.sin(first)*Math.sin(second) + Math.cos(first)*Math.cos(second) * Math.cos(mid) ) * R;
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
                    users =
                        '<div class="card">' +
                        '<div class="name">' +
                        '<p style="text-decoration: underline;">Name</p>' +
                        '<p>' + newResults[i].first_name + ' ' + newResults[i].last_name + '</p>' +
                        '</div>' +
                        '<div class="age">' +
                        '<p style="text-decoration: underline;">Age</p>' +
                        '<p>' + newResults[i].age + '</p>' +
                        '</div>' +
                        '<div class="img">' +
                        '<img src="/avatar/avatar_2.jpg">' +
                        '</div>' +
                        '<div class="bio">' +
                        '<p style="text-decoration: underline;">Bio</p>' +
                        '<p>' + newResults[i].bio + '</p>' +
                        '</div>' +
                        '<div class="hobbies">' +
                        '<p style="text-decoration: underline;">Hobbies</p>';
                        if (newResults[i].hobbies != null) {
                            users += '<p>' + newResults[i].hobbies +'</p>';
                        } else {
                            users += '<p>No hobbies listed</p>'
                        }
                        users += '</div>'
                    users += '<div class="distance">' +
                        '<p style="text-decoration: underline;">Distance</p>' +
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
                    users = 'No users to be added.';
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
    } else {
        let doc = fs.readFileSync("./app/html/login.html", "utf8");
        res.send(doc);
    }
  })

  app.post('/updateFriends', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
  
    let connection = mysql.createConnection({
        host: "127.0.0.1",
        user: "root",
        password: "passwordSQL",
        database: "comp2800",
        multipleStatements: "true"
    });
    connection.connect();
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
    connection.end();

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



// host: "127.0.0.1",
// user: "root",
// password: "",
// database: "comp2800",
// multipleStatements: "true"


app.post("/login", function (req, res) {
    res.setHeader("Content-Type", "application/json");
    const mysql = require("mysql2");
    const connection = mysql.createConnection({
        host: "127.0.0.1",
        user: "root",
        password: "passwordSQL",
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


app.get("/redirectToUsers", function (req, res) {
    if (req.session.loggedIn) {
        if(req.session.userType) {
            connection.connect();
             const getUsers = `USE comp2800; SELECT * FROM bby_users;`;
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

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, "./app/avatar/")
    },
    filename: function(req, file, callback) {
        // // callback(null, "avatar_" + file.originalname.split('/').pop().trim());
        const sessionID = "" + req.session.identity;
        // callback(null, "avatar_" + sessionID + "." + file.originalname.split(".").pop());
        callback(null, "avatar_" + sessionID + ".jpg");
    }
});

const upload = multer({ storage: storage });




//do we need this??
app.get('/', function (req, res) {
    let doc = fs.readFileSync('./app/html/index.html', "utf8");
    res.send(doc);

});



app.post('/upload-images', upload.array("files"), function (req, res) {

    for(let i = 0; i < req.files.length; i++) {
        req.files[i].filename = req.files[i].originalname;
    }

    connection.connect();
    if (!req.files[0].filename) {
        console.log("No file upload");
    } else {
        
        let imgsrc = "avatar_" + req.session.identity + "." + req.files[0].originalname.split(".").pop();
        let updateData = `DELETE FROM userphotos WHERE userID = ${req.session.identity}; INSERT INTO userphotos (userID, imageID) VALUES (?, ?);`
        
        console.log(imgsrc);
        connection.query(updateData, [req.session.identity, imgsrc], function(err, result) {
          
            if (err) throw err
            console.log("file uploaded")
        })
    }

});



// end of upload-app.js





 













// //For Milestone hand-ins:
// let port = 8000;
// app.listen(port, function () {
// });

//For Heroku deployment
app.listen(process.env.PORT || 3000);



