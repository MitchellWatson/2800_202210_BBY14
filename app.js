
//importing all the Node.js libraries from dependencies downloaded
const express = require('express');
const cookieParser = require("cookie-parser");
const sessions = require('express-session');
const mysql = require('mysql');
const path = require('path');


//Initialization of express app
const app = express();
const PORT = 8000;

//Initialization of SQL connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'comp2800'
});

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



//routes
    //http://localhost:8000/ to serve the HTML form to client, if logged in display log out link
    app.get('/', (request,response) => {
       
        if(request.session.loggedin) {
            response.send("Welcome User <a href=\'/logout'>click to logout</a>"); 
        } else 
            response.sendFile('/public/login/login.html', {root:__dirname});
    });



// http://localhost:8000/user
app.post('/user', (request, response) => {
	// Store the input fields
	let email = request.body.email;
	let password = request.body.password;
    

	// Non empty fields
	if (email && password) {
		// Execute sql query
		connection.query('SELECT * FROM login WHERE email = ? AND password = ?', [email, password], function(error, results, fields) {
			if (error) throw error;
			// If the account exists in DB
			if (results.length > 0) {
				// Authenticate the user/session
				request.session.loggedin = true;
				request.session.email = email;   
                response.send(`Welcome ${email} <a href=\'/logout'>click to logout</a>`)
			} else {
				response.send('Incorrect Username and/or Password!');
			}			
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});






//http://localhost:8000/logout
app.get('/logout', (req,res) => {
    req.session.destroy();
    res.redirect('/');
 });


app.listen(PORT, () => 
console.log(`Server running on port ${PORT}`)
);















    