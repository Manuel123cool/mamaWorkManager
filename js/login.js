"use strict";

function sendData(e) {
    e.preventDefault();
    var name = document.getElementById("name").value;
    var password = document.getElementById("password").value;
    
    var xmlhttp0 = new XMLHttpRequest();
    xmlhttp0.addEventListener('readystatechange', (e) => {
        if (xmlhttp0.readyState==4 && xmlhttp0.status==200) {
            var responseText = xmlhttp0.responseText;
            if (responseText == "went fine") {
                window.open("http://localhost/index.html", "_self");
            }
            const regex = new RegExp("Could not get Token", "ig")
            if (regex.test(responseText)) {
                window.open("http://localhost/php/error.php?error=true", "_self");
            }
            const regex = new RegExp("Could not set Token", "ig")
            if (regex.test(responseText)) {
                window.open("http://localhost/php/error.php?error=true", "_self");
            }
        }
    });
    xmlhttp0.open('POST', "php/login.php", true);
    xmlhttp0.setRequestHeader("Content-type", 
        "application/x-www-form-urlencoded");
    xmlhttp0.send("name=" + name + "&password=" + password);
}

var submit = document.getElementById("submit");
submit.addEventListener("click", sendData);
