var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
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
  document.addEventListener("DOMContentLoaded", function() {
      if (once == 0) {
        once++;
        localStorage.setItem("value", once);
        console.log("set" + once)
        modal.style.display = "block";
      }
     })


// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}