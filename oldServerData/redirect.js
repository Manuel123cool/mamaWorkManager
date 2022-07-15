"use strict"

let xmlhttp0 = new XMLHttpRequest();
xmlhttp0.addEventListener('readystatechange', (e) => {
if (xmlhttp0.readyState==4 && xmlhttp0.status==200) {
    let responseText = xmlhttp0.responseText;
    console.log(responseText)
    if (responseText == "Not right Token") {
	window.open("http://manuel-project.de/login.html", "_self");
    } 
}
});
xmlhttp0.open('GET', "php/get.php?data=false", true);
xmlhttp0.send(); 
