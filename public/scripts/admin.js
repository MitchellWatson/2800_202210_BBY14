/** This file contains the client-side javascript code for the admin page.
 * @author Mitchell Watson
 * @author Basil Kim
 */

//Getting divs to populate message
var popUp = document.getElementById("popUp");
var span = document.getElementsByClassName("close")[0];

//Messages used in the popup
const messages = [
    'Age is just a number for those who know how to make the most of their lives', 
    'Anyone who keeps learning stays young',
    'Enjoy your day, you deserve it',
    'The spirit never ages. It stays forever young',
    'Wrinkles should merely indicate where smiles have been',
    'You’re only as old as you feel',
    'With old age comes wisdom… and discounts!'
]

//Selection of random message
let chosen = messages[Math.floor(Math.random() * messages.length)]

//Writing of message to the div
var quote = document.getElementById("quote").innerHTML = chosen;

//Storing the value in localStorage
let once = localStorage.getItem("value");
localStorage.setItem("saved", 1);

//Event listener for the loading of the message
  document.addEventListener("DOMContentLoaded", function() {
      if (once == 0) {
        once++;
        localStorage.setItem("value", once);
        popUp.style.display = "block";
      }
     })

//Onclick activation of pop-up feature
span.onclick = function() {
    popUp.style.display = "none";
}

//Onclick activation of pop-up feature
window.onclick = function(event) {
  if (event.target == popUp) {
    popUp.style.display = "none";
  }
}