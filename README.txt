IV. File List
-------------

html files

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

javascript files

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


CSS files

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

json files

package.json            Contains the scripts and dependencies used in the application
package-lock.json       Contains the modules and dependencies used in the application

Heroku files

Procfile                Contains the script for Heroku initialization


V. Installation Guide
---------------------
Follow these steps in order to set up your development environment.

1. Initialize the gitHub repo on your local machine by using git clone https://github.com/MitchellWatson/COMP2800_202210_BBY14
2. Download MySQL Workbench using this guide https://docs.google.com/document/d/1W4lRtkAESGmQSdiW91C7x72vNBZhHe9o/edit 
3. Download Node.js onto your local machine using this guide https://www.guru99.com/download-install-node-js.html 
4. Use npm install to download all necessary modules required to run the application locally.
5. For local deployment and testing use port 8000 on your browser.
6. Set up your favourite IDE with the necessary plug-ins and extensions to more efficiently use Javascript, CSS, and HTML
7. Open MySQL Workbench and create a local server using the password and port info found in passwords.txt
8. Connect your local database.

Now you are ready to begin development.

IMPORTANT: 
- Do not push any new changes into the dev or main branches until your code has been reviewed.
- Push all changes only into you own feature branch that you have made.
- Testing should be done frequently and all observations can be recorded in our testing document here https://docs.google.com/spreadsheets/d/1JdL4Lb8Hv5I4owS6AWq03pmop-nttEItHK3_4ExhNNw/edit#gid=394496370
- We follow the naming convention FirstName_LastName_Feature for branches.

