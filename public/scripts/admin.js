var popUp = document.getElementById("popUp");

var span = document.getElementsByClassName("close")[0];

const messages = [
    'Age is just a number for those who know how to make the most of their lives', 
    'Anyone who keeps learning stays young',
    'Enjoy your day, you deserve it',
    'The spirit never ages. It stays forever young',
    'Wrinkles should merely indicate where smiles have been',
    'You’re only as old as you feel',
    'With old age comes wisdom… and discounts!'
]

let chosen = messages[Math.floor(Math.random() * messages.length)]

var quote = document.getElementById("quote").innerHTML = chosen;

let once = localStorage.getItem("value");
localStorage.setItem("saved", 1);
  document.addEventListener("DOMContentLoaded", function() {
      if (once == 0) {
        once++;
        localStorage.setItem("value", once);
        popUp.style.display = "block";
      }
     })


span.onclick = function() {
    popUp.style.display = "none";
}

window.onclick = function(event) {
  if (event.target == popUp) {
    popUp.style.display = "none";
  }
}