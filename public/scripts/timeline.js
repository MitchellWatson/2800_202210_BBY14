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

document.getElementById("new").addEventListener("click", function (e) {
    var drop = document.getElementById("drop");
    if (drop.style.display === "none") {
        drop.style.display = "block";
      } else {
        drop.style.display = "none";
      }
    })

    document.getElementById("done").addEventListener("click", function () {
        // e.preventDefault();
        var time = new Date();
        var full = "" + time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds();
        let date = document.getElementById("dateInput");
        let posts = document.getElementById("descInput");
        let queryString = "posts=" + posts.value + "&postDate=" + date.value + "&postTime=" + full;
        ajaxPOST("/addTimeline", function (data) {
            if (data) {
                let dataParsed = JSON.parse(data);
    
                if (dataParsed.status == "fail") {
                    document.getElementById("errorMsg").innerHTML = dataParsed.msg;
                } else {
                    window.location.replace("/timeline");
                }
            }
    
        }, queryString);
    })

let buttonUpdate = document.getElementsByClassName("update");

for (let i = 0; i < buttonUpdate.length; i++) {
    buttonUpdate[i].addEventListener("click", update);
}

    function update() {
    // e.preventDefault();
    let id = this.target;
    let posts = document.getElementById("descInput" + id);
    let queryString = "posts=" + posts.value + "&postNum=" + id;
    ajaxPOST("/updateTimeline", function (data) {
        if (data) {
            let dataParsed = JSON.parse(data);

            if (dataParsed.status == "fail") {
                document.getElementById("errorMsg").innerHTML = dataParsed.msg;
            } else {
                window.location.replace("/timeline");
            }
        }

    }, queryString);
}

