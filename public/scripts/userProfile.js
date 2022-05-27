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

// Initial latitude and longitude
let latitude = 0
let longitude = 0;

var popUp = document.getElementById("popUp");
var btn = document.getElementById("location");
var span = document.getElementsByClassName("close")[0];
var quote = document.getElementById("quote").innerHTML = 'Location has been sucessfully reset.<span class="material-symbols-outlined">done</span>';

btn.addEventListener("click", function () {
    if (navigator.geolocation) {
        console.log("here2")
        navigator.geolocation.getCurrentPosition(showPosition);
    }

    // Function to get location and update to database
    function showPosition(position) {
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
        popUp.style.display = "block";
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

span.onclick = function () {
    popUp.style.display = "none";
}

window.onclick = function (event) {
    if (event.target == popUp) {
        popUp.style.display = "none";
    }
}

// Alerts user when save profile
let saved = localStorage.getItem("saved");
document.addEventListener("DOMContentLoaded", function () {
    var quote = document.getElementById("quote").innerHTML = 'Profile information succesfully saved.<span class="material-symbols-outlined">done</span>';
    if (saved == 0) {
        saved++;
        localStorage.setItem("saved", saved);
        popUp.style.display = "block";
    }
})

span.onclick = function () {
    popUp.style.display = "none";
}

window.onclick = function (event) {
    if (event.target == popUp) {
        popUp.style.display = "none";
    }
}

// Update users information to the database
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
    localStorage.setItem("saved", 0);
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
