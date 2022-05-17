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




document.getElementById("submit").addEventListener("click", function (e) {
    
    e.preventDefault();
    let email = document.getElementById("emailInput");
    let password = document.getElementById("passwordInput");
    let first = document.getElementById("firstNameInput");
    let last = document.getElementById("lastNameInput");
    console.log(last);
    let queryString = "email=" + email.value + "&password=" + password.value + "&first_name=" + first.value + "&last_name=" + last.value;
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