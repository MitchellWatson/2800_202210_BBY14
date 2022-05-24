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


document.getElementById("submit").addEventListener("click", function (e) {
    
    e.preventDefault();
    let email = document.getElementById("emailInput");
    let password = document.getElementById("passwordInput");
    let first = document.getElementById("firstNameInput");
    let last = document.getElementById("lastNameInput");
    let age = document.getElementById("ageInput");
    let bio = document.getElementById("bioInput");
    let hobbies = document.getElementById("hobbiesInput");
    let queryString = "email=" + email.value + "&password=" + password.value + "&first_name=" + first.value + "&last_name=" + last.value + "&latitude=" + latitude + "&longitude=" + longitude + "&age=" + age.value + "&bio=" + bio.value + "&hobbies=" + hobbies.value;
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

function saveAlert() {
    alert("Information Saved!");
  }
function logoutAlert() {
    alert("You have logged out!");
  }