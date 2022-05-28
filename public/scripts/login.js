// Code to do client side is adapted from a COMP 1537 assignment

"use strict";

// Ajaxs XML HTTP call to url given and callback method 
ready(function () {
    // Ajaxs get for getting data to http
    function ajaxGET(url, callback) {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
            if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
                callback(this.responseText);

            } else {
            }
        }
        xhr.open("GET", url);
        xhr.send();
    }
    
    // Ajax post for giving data 
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
    let result = localStorage.getItem("result");
    let success = localStorage.getItem("success");

    // On load will launch modal pop up
    window.addEventListener("load", function () {
        if (result == 1 && success == 1) {
            popUp.style.display = "block";
            document.getElementById("quote").innerHTML = 'Account successfully registered. <span class="material-symbols-outlined">done</span>';
        }
        localStorage.setItem("success", 0)
        localStorage.setItem("result", 0)
    })

    // Will submit input values upon submit button press
    document.querySelector("#submit").addEventListener("click", function (e) {
        localStorage.setItem("value", 0);
        e.preventDefault();
        let email = document.getElementById("email");
        let password = document.getElementById("password");
        let queryString = "email=" + email.value.trim() + "&password=" + password.value.trim();
        const vars = {
            "email": email,
            "password": password
        }
        ajaxPOST("/login", function (data) {
            if (data) {
                let dataParsed = JSON.parse(data);
                if (dataParsed.status == "fail") {
                    document.getElementById("incorrect").innerHTML = dataParsed.msg;
                } else {
                    window.location.replace("/main");
                }
            }
        }, queryString);
    });
});

// Event callback listener for page loaded
function ready(callback) {
    if (document.readyState != "loading") {
        callback();
    } else {
        document.addEventListener("DOMContentLoaded", callback);
    }
}
