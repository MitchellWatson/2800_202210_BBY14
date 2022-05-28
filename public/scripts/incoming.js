/** This file holds the code for incoming requests.
 * @author Mitchell Watson
 * 
 */

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
        }
    }
    xhr.open("POST", url);
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(params);
}

let declines = document.getElementsByClassName("decline");

for (let i = 0; i < declines.length; i++) {
    declines[i].addEventListener("click", updateDecline);
}

//Function that delete
function updateDecline() {
    let id = this.target;
    let queryString = "accepted=" + 0 + "&viewed=" + 1 + "&reqNum=" + id;
    ajaxPOST("/updateIncoming", function (data) {
        if (data) {
            let dataParsed = JSON.parse(data);

            if (dataParsed.status == "fail") {
                document.getElementById("errorMsg").innerHTML = dataParsed.msg;
            } else {
                window.location.replace("/incoming");
            }
        }

    }, queryString);
}

let accepts = document.getElementsByClassName("accept");

for (let i = 0; i < accepts.length; i++) {
    accepts[i].addEventListener("click", updateAccept);
}

function updateAccept() {
    let id = this.target;
    let queryString = "accepted=" + 1 + "&viewed=" + 1 + "&reqNum=" + id;
    ajaxPOST("/updateIncoming", function (data) {
        if (data) {
            let dataParsed = JSON.parse(data);

            if (dataParsed.status == "fail") {
                document.getElementById("errorMsg").innerHTML = dataParsed.msg;
            } else {
                window.location.replace("/incoming");
            }
        }

    }, queryString);
}
