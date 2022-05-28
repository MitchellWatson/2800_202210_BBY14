"use strict";

// Ajax post to give data to middle ware
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
        }
    }
    xhr.open("POST", url);
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(params);
}

// Pop up modal element getters
var popUp = document.getElementById("popUp");
var span = document.getElementsByClassName("close")[0];

// Close modal button 
span.onclick = function () {
    popUp.style.display = "none";
}

// Click off modal to close
window.onclick = function (event) {
    if (event.target == popUp) {
        popUp.style.display = "none";
    }
}

// Will fetch local storage for result and success
let request = localStorage.getItem("request");
let passed = localStorage.getItem("passed");

// On load will launch modal pop up
window.addEventListener("load", function () {
    if (request == 1 && passed == 1) {
        popUp.style.display = "block";
        document.getElementById("quote").innerHTML = 'Meet-up request was succesfully sent. <span class="material-symbols-outlined">done</span>';
    } else if (request == 1 && passed == 0) {
        popUp.style.display = "block";
        document.getElementById("quote").innerHTML = 'Meet-up request was unsuccesful. Please try again. <span class="material-symbols-outlined">close</span>';
    }
    localStorage.setItem("request", 0)
    localStorage.setItem("passed", 0)
})

// Will submit input values upon request button press
document.getElementById("request").addEventListener("click", function () {
    let person = document.getElementById("personInput");
    let date = document.getElementById("dateInput");
    let where = document.getElementById("placeInput");
    let reason = document.getElementById("reasonInput");
    let queryString = "requestee=" + person.value + "&date=" + date.value + "&place=" + where.value.trim() + "&reason=" + reason.value.trim();
    
    // Sets local storages for modal pop up and sends data
    ajaxPOST("/addRequest", function (data) {
        if (data) {
            let dataParsed = JSON.parse(data);
            if (dataParsed.status == "fail") {
                localStorage.setItem("request", 1)
                localStorage.setItem("passed", 0)
                window.location.replace("/request");
            } else {
                localStorage.setItem("request", 1)
                localStorage.setItem("passed", 1)
                window.location.replace("/request");
            }
        }
    }, queryString);
})
