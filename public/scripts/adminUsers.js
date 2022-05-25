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

let inputs = document.getElementsByClassName('inputs');

document.getElementById("edit").addEventListener("click", function () {
    for (let i = 0; i < inputs.length; i++) {
        inputs[i].readOnly = false;
    }
})


let buttonUpdate = document.getElementsByClassName("submit");

for (let i = 0; i < buttonUpdate.length; i++) {
    buttonUpdate[i].addEventListener("click", update);
}

    function update() {
    // e.preventDefault();
    let id = this.target;
    console.log(id);
    let email = document.getElementById("emailInput" + id);
    let password = document.getElementById("passwordInput" + id);
    let first = document.getElementById("firstNameInput" + id);
    let last = document.getElementById("lastNameInput" + id);
    let admin = document.getElementById("adminInput" + id);
    console.log(admin);
    let queryString = "email=" + email.value + "&password=" + password.value + "&first_name=" + first.value + "&last_name=" + last.value + "&is_admin=" + admin.value + "&id=" + id;
    ajaxPOST("/updateAdmin", function (data) {
        if (data) {
            let dataParsed = JSON.parse(data);

            if (dataParsed.status == "fail") {
                document.getElementById("errorMsg").innerHTML = dataParsed.msg;
            } else {
                window.location.replace("/admin-users");
            }
        }

    }, queryString);
}

let buttonDelete = document.getElementsByClassName("delete");

for (let i = 0; i < buttonDelete.length; i++) {
    buttonDelete[i].addEventListener("click", deleted);
}

    function deleted() {
    // e.preventDefault();
    let id = this.target;
    console.log(id);
    let queryString = "id=" + id;
    ajaxPOST("/deleteAdmin", function (data) {
        if (data) {
            let dataParsed = JSON.parse(data);

            if (dataParsed.status == "fail") {
                document.getElementById("errorMsg").innerHTML = dataParsed.msg;
            } else {
                window.location.replace("/admin-users");
            }
        }

    }, queryString);
}