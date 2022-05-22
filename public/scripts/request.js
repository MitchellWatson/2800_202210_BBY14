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
                    document.getElementById("errorMsg").innerHTML = dataParsed.msg;
                } else {
                    window.location.replace("/meet");
                }
            }
    
        }, queryString);
    })

