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

var popUp = document.getElementById("popUp");

var span = document.getElementsByClassName("close")[0];

span.onclick = function() {
    popUp.style.display = "none";
}

window.onclick = function(event) {
  if (event.target == popUp) {
    popUp.style.display = "none";
  }
}

    let request = localStorage.getItem("request");
    let passed = localStorage.getItem("passed");
    window.addEventListener("load", function () {
        console.log("here")
        if (request == 1 && passed == 1) {
            console.log("here2")
            popUp.style.display = "block";
            document.getElementById("quote").innerHTML = 'Meet-up request was succesfully sent. <span class="material-symbols-outlined">done</span>';
        } else if (request == 1 && passed == 0) {
            popUp.style.display = "block";
            document.getElementById("quote").innerHTML = 'Meet-up request was unsuccesful. Please try again. <span class="material-symbols-outlined">close</span>';
        }
        localStorage.setItem("request", 0)
        localStorage.setItem("passed", 0)
    })

    document.getElementById("request").addEventListener("click", function () {
        // e.preventDefault();
        let person = document.getElementById("personInput");
        let date = document.getElementById("dateInput");
        let where = document.getElementById("placeInput");
        let reason = document.getElementById("reasonInput");

        let queryString = "requestee=" + person.value + "&date=" + date.value + "&place=" + where.value + "&reason=" + reason.value;
        ajaxPOST("/addRequest", function (data) {
            if (data) {
                let dataParsed = JSON.parse(data);
    
                if (dataParsed.status == "fail") {
                    console.log("here3")
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

