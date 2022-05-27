## I.    PROJECT TITLE
**GABIFY**

## II.   PROJECT DESCRIPTION
Gabify is a chat application to help seniors socialize and stay mentally active with content for users to promote nostalgia and reminisce about their past. The application is currently in version 1.5.

## III.  TECHNOLOGIES USED
1. FRONTEND
    * html              v5.2
    * CSS               v2.1
    * javascript        vES6
    * jquery            v3.5.1

2. BACKEND
    * node.js           v18.2.0
    * express           v4.18.1
    * express-session   v1.17.3
    * body-parser       v1.20.0
    * jsdom             v19.0.0
    * moment            v2.29.3
    * multer            v1.4.4
    * mysql             v2.18.1
    * mysql2            v2.3.3
    * nodemon           v2.0.16
    * socket.io         v4.5.1

3. DATABASE
    * mysql             v8.0.29
    * cleardb           

4. OTHER SOFTWARE
    * npm
    * github
    * visual studio code

# IV.   LISTING OF FILE CONTENTS OF FOLDER
### FILE TREE
```
.
├── Procfile
├── app
│   ├── avatar
│   │   ├── avatar_1.jpg
│   │   ├── avatar_2.jpg
│   │   ├── avatar_3.jpg
│   │   └── avatar_4.jpg
│   ├── data
│   │   └── database.sql
│   ├── html
│   │   ├── admin.html
│   │   ├── adminUsers.html
│   │   ├── card.html
│   │   ├── chatGlobalRoom.html
│   │   ├── chatGlobalSelect.html
│   │   ├── contact.html
│   │   ├── footer.html
│   │   ├── friendFinder.html
│   │   ├── gabChat.html
│   │   ├── game.html
│   │   ├── help.html
│   │   ├── incoming.html
│   │   ├── index.html
│   │   ├── login.html
│   │   ├── main.html
│   │   ├── meet.html
│   │   ├── nav.html
│   │   ├── register.html
│   │   ├── request.html
│   │   ├── schedule.html
│   │   ├── timeline.html
│   │   ├── userProfiles.html
│   │   └── userSettings.html
│   └── posts
├── gabify.js
├── helpers
│   ├── formatDate.js
│   ├── userHelper.js
│   └── users.js
├── package-lock.json
├── package.json
├── public
│   ├── images
│   │   ├── favicon.ico
│   │   └── gabify.png
│   ├── scripts
│   │   ├── admin.js
│   │   ├── adminUsers.js
│   │   ├── chatGlobal.js
│   │   ├── easterEgg.js
│   │   ├── friendFinder.js
│   │   ├── gabChat.js
│   │   ├── game.js
│   │   ├── help.js
│   │   ├── incoming.js
│   │   ├── login.js
│   │   ├── main.js
│   │   ├── register.js
│   │   ├── request.js
│   │   ├── skeleton.js
│   │   ├── timeline.js
│   │   ├── upload.js
│   │   └── userProfile.js
│   └── styles
│       ├── adminUsers.css
│       ├── chatGlobalRoom.css
│       ├── chatGlobalSelect.css
│       ├── contact.css
│       ├── easterEgg.css
│       ├── friendFinder.css
│       ├── gabChat.css
│       ├── game.css
│       ├── help.css
│       ├── incoming.css
│       ├── login.css
│       ├── main.css
│       ├── meet.css
│       ├── register.css
│       ├── request.css
│       ├── skeleton.css
│       ├── timeline.css
│       ├── userCRUD.css
│       ├── userProfile.css
│       └── userSettings.css
└── readme.md
```

### DESCRIPTION OF FILES
```
HTML FILES

database.sql            File to store the database and tables for storing data
admin.html              Frontend html file for admin dashboard
card.html               Frontend html file to store the card for user information
chatGlobalRoom.html     Frontend html file to store the global chatroom
chatGlobalSelect.html   Frontend html file to store the login for the global chatroom
contact.html            Frontend html file to store the list of contacts page
footer.html             Frontend html file to store the footer bar for all pages
friendFinder.html       Frontend html file to store the friend
gabChat.html            Frontend html file to store the one-to-one chat
game.html               Frontend html file for the game feature
help.html               Frontend html file to store the help page
incoming.html           Frontend html file to store the incoming requests of users
login.html              Frontend html file to store the login page
meet.html               Frontend html file to store the meetup page
nav.html                Frontend html file to store the navigation bar for all pages
register.html           Frontend html file to store the registration page
request.html            Frontend html file to store the requests page
schedule.html           Frontend html file to store the schedule of meetups page
timeline.html           Frontend html file to store the timeline journal page
userProfiles.html       Frontend html file to store the profile page of users
userSettings.html       Frontend html file to store the user settings page

CSS FILES

admin.css               Contains the stylesheet code for the admin page
adminUsers.css          Contains the stylesheet code for the adminUsers page
chatGlobalRoom.css      Contains the stylesheet code for the global chat page
chatGlobalSelect.css    Contains the stylesheet code for the gloabl chat login page
contact.css             Contains the stylesheet code for the contacts page
easterEgg.css           Contains the stylesheet code for the easter egg in the login page               
friendFinder.css        Contains the stylesheet code for the friendFinder page
gabChat.css             Contains the stylesheet code for the private chat page
game.css                Contains the stylesheet code for the game page
help.css                Contains the stylesheet code for the help page
incoming.css            Contains the stylesheet code for the incoming requests page
login.css               Contains the stylesheet code for the login page
main.css                Contains the stylesheet code for the home page
meet.css                Contains the stylesheet code for the meetup page
register.css            Contains the stylesheet code for the register page
request.css             Contains the stylesheet code for the request page
skeleton.css            Contains the stylesheet code for the skeleton used for the navbar and footer in all pages
timeline.css            Contains the stylesheet code for the admin page used for the timeline page
userProfile.css         Contains the stylesheet code for the admin page used for the user profile page
userSettings.css        Contains the stylesheet code for the admin page used for the user settings page

JAVASCRIPT FILES

gabify.js               Contains the back-end server code for the application
formatDate.js           Contains the client-side javascript code for the helper methods for chat
userHelper.js           Contains the client-side javascript code for the helper methods for chat
users.js                Contains the client-side javascript code for users page
admin.js                Contains the client-side javascript code for admin page
adminUsers.js           Contains the client-side javascript code for adminusers page
chatGlobal.js           Contains the client-side javascript code for global chat page
easterEgg.js            Contains the client-side javascript code for the easter egg in the login page
friendFinder.js         Contains the client-side javascript code for friendFinder page
gabChat.js              Contains the client-side javascript code for private chat page
game.js                 Contains the client-side javascript code for game page
help.js                 Contains the client-side javascript code for help page
incoming.js             Contains the client-side javascript code for incoming requests page
login.js                Contains the client-side javascript code for login page
main.js                 Contains the client-side javascript code for main page
register.js             Contains the client-side javascript code for register page
request.js              Contains the client-side javascript code for requests page

JSON FILES

package.json            Contains the scripts and dependencies used in the application
package-lock.json       Contains the modules and dependencies used in the application

HEROKU FILES

Procfile                Contains the script for Heroku initialization
```

## V.    HOW TO INSTALL OR RUN THE PROJECT
1. LANGUAGES
    * html
    * css
    * javascript
    * mysql

2. API & FRAMEWORKS
    * node.js
    * express
    * express-session
    * body-parser
    * jsdom
    * moment
    * multer
    * mysql
    * mysql2
    * nodemon
    * socket.io

3. API KEY REQUIREMENT
    * NA

4. INSTALLATION
    1. Clone [main repository](https://github.com/MitchellWatson/COMP2800_202210_BBY14.git)
    2. Install Node.js
    3. Install MySQL
    4. Run `source <./database.sql>;` in MySQL where `<./database.sql>` is the absolute path of the file
    5. Start your MySQL server
    6. Run `npm install` in terminal of project root folder
    7. Run `npm run start` in terminal of project root folder
    9. Open `localhost:8000` in browser
    10. Login with provided credentials in assignment 05c & 05d by **BBY-Team 14**
    11. Set up your favourite IDE with the necessary plug-ins and extensions to more efficiently use HTML, CSS, Javascript
    12. Open MySQL Workbench and create a local server using the password and port info found in passwords.txt
    13. Connect your local database.

    Now you are ready to begin development.

    IMPORTANT: 
    - Do not push any new changes into the dev or main branches until your code has been reviewed.
    - Push all changes only into your own feature branch that you have made.
    - Testing should be done frequently and all observations can be recorded in our testing document here https://docs.google.com/spreadsheets/d/1JdL4Lb8Hv5I4owS6AWq03pmop-nttEItHK3_4ExhNNw/edit#gid=394496370
    - We follow the naming convention FirstName_LastName_Feature for branches.

## VI.   HOW TO USE THE PRODUCT (FEATURES)
Setup: Login with provided credentials in assignment 05c & 05d by BBY-Team 14 or register an account.

### Friend Finder
1. Go to main page.
2. Go to `Friend Finder` to match with local seniors in your area sorted by location.
3. Click `Add Friend` on person you want to befriend. Both users must friend each other to be added succesfully.

### Meet-Up
1. Go to main page.
2. Click on `Meet-Up` to manage friend meet-ups.
3. You can click `Request Meet-Up`, which allows you to ask a friend for a custom meet-up. 
4. View `Incoming Requests`, which allows you to see if anyone has sent you a meet-up request.
5. View your `Meet-Up Schedule`, which shows what planned and accepted meet-ups you have coming up. 

### Private Chat
1. Go to any page.
2. Click `Contact` in the bottom navbar.
3. Here you can see your friends where you both have friended each other. You can click `Chat` to go to a private chat room with that friend.
4. Type message into bottom chat input textbox and click the `Send` button.

### Global Chat
1. Go to main page.
2. Click on `Chat` to view preset, global chatrooms of popular topics. 
3. Select preset topic, click `Join Chat` to start talking with others.
4. Type message into bottom chat input textbox and click the `Send` button.

### Journal
1. Go to main page
2. Click on `Journal`. Here you can view your added memories.
3. Click `Add Memory` to add a memory. 
4. Choose the date it happend and a brief description of the memory.  
5. Click `Done` to save memory.
6. Edit memories by clicking on the description textbox, changing input, then click `Update` to save changes.

### Profile
1. Go to main page.
2. Click `Profile`. This will show you your account information.
3. To upload new profile photo, click `Choose files`, choose your file, then click `Upload photo`
4. To update account information, edit input text fields then click `Save Info` at bottom of the form.
5. To reset location, click `Set Location` at bottom of the form.
6. To logout, click `Logout` at bottom of the form.

### Help
1. Go to any page.
2. Click on `Help` in top navbar.
3. Browse through FAQs and read corresponding solutions and helpful links.

### Featured Game (User only)
1. Go to main page.
2. Click on `Featured Game`.
3. Click `Start` to play the Gabify's featured game which is `60's & 70's Trivia`.

### Manage Users (Admin only)
1. Go to main page.
2. Click on `Manage Users`.
3. To create user, click `Create User` at top.
4. To edit prexisting user data, click `Edit Users` at top to open text input for editing.
5. Edit user information then click `Save` on user card once done.
6. To delete user, go to specified user and click `Delete`.

## VII.  CREDITS, REFERENCES, & LICENSES
**[Calculating distance between user coordinates]**(https://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula)
**[Trivia Game]**(https://www.youtube.com/watch?v=riDzcEQbX6k)
**[Chat Tutorial]**(https://www.youtube.com/watch?v=ZKEqqIO7n-k)
**[Chat Tutorial]**(https://www.youtube.com/watch?v=rxzOqP9YwmM)
**[Chat Tutorial]**(https://www.youtube.com/watch?v=jD7FnbI76Hg)

## VIII. CONTACT INFORMATION
[Basillio Kim](mailto:bkim128@my.bcit.ca)  
[Mitchell Watson](mailto:mwatson75@my.bcit.ca)  
[Jackie Ma](mailto:jma149@my.bcit.ca)  
[Ryan Chau](mailto:rchau15@my.bcit.ca)