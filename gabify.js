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
        let doc = fs.readFileSync("./app/html/register.html", "utf8");
        res.send(doc);
    }
);

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
        profileDOM.window.document.querySelector("#emailInput").setAttribute('value', req.session.email);
        profileDOM.window.document.querySelector("#passwordInput").setAttribute('value', req.session.password);
        profileDOM.window.document.querySelector("#firstNameInput").setAttribute('value', req.session.first_name);
        profileDOM.window.document.querySelector("#lastNameInput").setAttribute('value', req.session.last_name);


        profileDOM.window.document.querySelector("#header").innerHTML = navBarDOM.window.document.querySelector("#header").innerHTML;
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
        password: "",
        database: "comp2800",
        multipleStatements: "true"
    });
    connection.connect();
    connection.query('INSERT INTO bby14_users VALUES (?, ?, ?, ?, ?, ?)',
      [req.body.ID, req.body.first_name, req.body.last_name, req.body.email, req.body.password, req.body.is_admin],
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
        password: "",
        database: "comp2800",
        multipleStatements: "true"
    });
    connection.connect();
    connection.query('UPDATE bby14_users SET email = ? , password = ?, first_name = ?, last_name = ? WHERE ID = ?',
      [req.body.email, req.body.password, req.body.first_name, req.body.last_name, req.session.identity],
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
              req.session.userType = validUserInfo.is_admin;
  
              req.session.save(function (err) {
                  // session saved. for analytics we could record this in db
              })
          }
      })
    connection.end();
  
  });

  app.get("/admin-users", function (req, res) {
    if (req.session) {
      let profile = fs.readFileSync("./app/html/adminUsers.html", "utf8");
      let profileDOM = new JSDOM(profile);
  
      const mysql = require("mysql2");
  
      const connection = mysql.createConnection({
        host: "127.0.0.1",
        user: "root",
        password: "",
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
  
          const usersProfiles = profileDOM.window.document.createElement("table");
  
          let users;
  
          usersProfiles.innerHTML =
            "<tr>" +
            "<th>" +
            "ID" +
            "</th>" +
            "<th>" +
            "First Name" +
            "</th>" +
            "<th>" +
            "Last Name" +
            "</th>" +
            "<th>" +
            "E-mail" +
            "</th>" +
            "<th>" +
            "Administrator" +
            "</th>" +
            "<th>" +
            "</tr>";
          for (let i = 0; i < results.length; i++) {
            users =
              "<td>" +
              results[i].ID +
              "</td>" +
              "<td>" +
              results[i].first_name +
              "</td>" +
              "<td>" +
              results[i].last_name +
              "</td>" +
              "<td>" +
              results[i].email +
              "</td>" +
              "<td>" +
              results[i].is_admin +
              "</td>";
              usersProfiles.innerHTML += users;
          }
          let create = "<td><a href='/register'><button class='option'> Create </button></a></td>";

          usersProfiles.innerHTML += create;

  
          profileDOM.window.document
            .getElementById("user_table")
            .appendChild(usersProfiles);

            let navBar = fs.readFileSync("./app/html/nav.html", "utf8");
            let navBarDOM = new JSDOM(navBar);
            let string = `Users`;
            let t = navBarDOM.window.document.createTextNode(string);
            navBarDOM.window.document.querySelector("#welcome").appendChild(t);

            profileDOM.window.document.querySelector("#header").innerHTML = navBarDOM.window.document.querySelector("#header").innerHTML;
  
          res.set("Server", "candy");
          res.set("X-Powered-By", "candy");
          res.send(profileDOM.serialize());
        }
      );
    }
  })

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




