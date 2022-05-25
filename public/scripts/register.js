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
document.getElementById("location").addEventListener("click", function () {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    
function showPosition(position) {
  latitude = position.coords.latitude;
  longitude = position.coords.longitude;
}
})

var popUp = document.getElementById("popUp");

var btn = document.getElementById("location");

var span = document.getElementsByClassName("close")[0];

var quote = document.getElementById("quote").innerHTML = 'Location has been sucessfully set.<span class="material-symbols-outlined">done</span>';

  btn.addEventListener("click", function() {
        popUp.style.display = "block";
     })


span.onclick = function() {
    popUp.style.display = "none";
}

window.onclick = function(event) {
  if (event.target == popUp) {
    popUp.style.display = "none";
  }
}


document.getElementById("submit").addEventListener("click", function (e) {
    
    
    
    e.preventDefault();
    let email = document.getElementById("emailInput");
    let password = document.getElementById("passwordInput");
    let first = document.getElementById("firstNameInput");
    let last = document.getElementById("lastNameInput");
    localStorage.setItem("register", 0)
    let queryString = "email=" + email.value + "&password=" + password.value + "&first_name=" + first.value + "&last_name=" + last.value + "&latitude=" + latitude + "&longitude=" + longitude;
    ajaxPOST("/create", function (data) {
        if (data) {
            let dataParsed = JSON.parse(data);

            if (dataParsed.status == "fail") {
                document.getElementById("errorMsg").innerHTML = dataParsed.msg;
            } else {
                localStorage.setItem("email", email.value);
                window.location.replace("/");
            }
        }

    }, queryString);
});

function regAlert() {
    alert("Register Complete!");
  }