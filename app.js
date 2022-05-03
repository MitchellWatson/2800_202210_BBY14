//importing all the Node.js libraries from dependencies downloaded
const express = require('express');
const cookieParser = require("cookie-parser");
const sessions = require('express-session');

//Initialization of express app
const app = express();
const PORT = 4000;

//Express-session options
const oneDay = 1000 * 60 * 60 * 24 //ms in a day


//session middleware
app.use(sessions({
    secret: "secretkey12345",
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false
}));

//parsing HTML form
    //parse incoming data
    app.use(express.json());
    app.use(express.urlencoded({ extended: true}));
    //serving public file
    app.use(express.static(__dirname));

//Set the cookie-parser
    //cookie-parser middleware
    app.use(cookieParser());

//Replacing the database function by hardcoding password/username for testing session
const myusername = 'user1';
const mypassword = 'mypassword';
var session;

//routes
    //http://localhost:4000/ to serve the HTML form to client, if logged in display log out link
    app.get('/', (req,res) => {
        session=req.session;
        if(session.userid) {
            res.send("Welcome User <a href=\'/logout'>click to logout</a>");
            
        } else 
            res.sendFile('public/index.html', {root:__dirname});
    });

    //http://localhost:4000/user to create a session,
        // if successful login user granted access and server will create a temp user session with a random string as session id and save that string into cookie
        app.post('/user',(req,res) => {
            if(req.body.username == myusername && req.body.password == mypassword) {
                session=req.session;
                session.userid=req.body.username;
                console.log(req.session);
                res.send(`Hey there, welcome <a href=\'/logout'>click to logout</a`);
            } else {
                res.send('Invalid username or password');
            }
        });

    //http://localhost:4000/logout
        app.get('/logout', (req,res) => {
            req.session.destroy();
            res.redirect('/');
        });

    app.listen(PORT, () => 
        console.log(`Server running on port ${PORT}`)
    );