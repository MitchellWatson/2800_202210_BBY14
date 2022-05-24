"use strict";

function ajaxPOST(url, callback, data) {
    let params = typeof data == 'string' ? data : Object.keys(data).map(
        function (k) {
            return encodeURIComponent(k) + '=' + encodeURIComponent(data[k])
        }
    ).join('&');

    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
            callback(this.responseText);

        } else {
            console.log(this.status);
        }
    }
    xhr.open("POST", url);
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(params);
}



let latitude = 0
let longitude = 0;
// document.getElementById("location").addEventListener("click", function () {
//     if (navigator.geolocation) {
//         console.log("here2")
//         navigator.geolocation.getCurrentPosition(showPosition);
//     }
    
// function showPosition(position) {
//   latitude = position.coords.latitude;
//   longitude = position.coords.longitude;
// }
// })

var modal = document.getElementById("myModal");
// Get the button that opens the modal
var btn = document.getElementById("location");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];
var quote = document.getElementById("quote").innerHTML = "Location has been sucessfully reset.";

  btn.addEventListener("click", function() {
    if (navigator.geolocation) {
        console.log("here2")
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    
function showPosition(position) {
  latitude = position.coords.latitude;
  longitude = position.coords.longitude;
  modal.style.display = "block";
  let queryString = "latitude=" + latitude + "&longitude=" + longitude;
  ajaxPOST("/updateLocation", function (data) {
      if (data) {
          let dataParsed = JSON.parse(data);

          if (dataParsed.status == "fail") {
              document.getElementById("errorMsg").innerHTML = dataParsed.msg;
          }
      }

  }, queryString);
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

document.getElementById("submit").addEventListener("click", function (e) {
    
    e.preventDefault();
    let email = document.getElementById("emailInput");
    let password = document.getElementById("passwordInput");
    let first = document.getElementById("firstNameInput");
    let last = document.getElementById("lastNameInput");
    let age = document.getElementById("ageInput");
    let bio = document.getElementById("bioInput");
    let hobbies = document.getElementById("hobbiesInput");
    let queryString = "email=" + email.value + "&password=" + password.value + "&first_name=" + first.value + "&last_name=" + last.value + "&age=" + age.value + "&bio=" + bio.value + "&hobbies=" + hobbies.value;
    ajaxPOST("/updateUser", function (data) {
        if (data) {
            let dataParsed = JSON.parse(data);

            if (dataParsed.status == "fail") {
                document.getElementById("errorMsg").innerHTML = dataParsed.msg;
            } else {
                localStorage.setItem("email", email.value);
                window.location.replace("/userProfiles");
            }
        }

    }, queryString);
});

