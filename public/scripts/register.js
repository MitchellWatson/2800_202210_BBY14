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

// Get location of user
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

btn.addEventListener("click", function () {
    var quote = document.getElementById("quote").innerHTML = 'Location has been sucessfully set.<span class="material-symbols-outlined">done</span>';
    popUp.style.display = "block";
})

span.onclick = function () {
    popUp.style.display = "none";
}

window.onclick = function (event) {
    if (event.target == popUp) {
        popUp.style.display = "none";
    }
}

document.getElementById("question").addEventListener("click", function () {
    document.getElementById("answer").style.display = "block";
})

let result = localStorage.getItem("result");
let success = localStorage.getItem("success");

document.addEventListener("DOMContentLoaded", function () {
    if (result == 1 && success == 0) {
        popUp.style.display = "block";
        document.getElementById("quote").innerHTML = 'Account was not registered. Please try again.<span class="material-symbols-outlined">close</span>';
        localStorage.setItem("success", 0)
        localStorage.setItem("result", 0)
    }
})

// Register users and update to database
document.getElementById("submit").addEventListener("click", function (e) {
    e.preventDefault();
    let email = document.getElementById("emailInput");
    let password = document.getElementById("passwordInput");
    let first = document.getElementById("firstNameInput");
    let last = document.getElementById("lastNameInput");
    localStorage.setItem("register", 0)
    let queryString = "email=" + email.value.trim() + "&password=" + password.value.trim() + "&first_name=" + first.value.trim() + "&last_name=" + last.value.trim() + "&latitude=" + latitude + "&longitude=" + longitude;
    ajaxPOST("/create", function (data) {
        if (data) {
            let dataParsed = JSON.parse(data);
            if (dataParsed.status == "success") {
                localStorage.setItem("success", 1)
                localStorage.setItem("result", 1)
                window.location.replace("/");
            } else {
                localStorage.setItem("success", 0)
                localStorage.setItem("result", 1)
                window.location.replace("/register");
            }
        }
    }, queryString);
});
