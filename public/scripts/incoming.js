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

document.getElementById("decline").addEventListener("click", function () {
        // e.preventDefault();
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
})


document.getElementById("accept").addEventListener("click", function () {
    // e.preventDefault();
    let id = this.target;
    console.log("This is the id " + id)
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
})
