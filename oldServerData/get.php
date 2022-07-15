<?php
include "login.php";

if (isset($_GET["data"]) && validLoginData()) {
    if ($_GET["data"] == "false") {
	exit();
    }
    $path = "/home/manuel/server_data/data.txt";
    $data = file_get_contents($path);
    if($data == false) {
        echo "Could not get Data";
    }
    echo $data;
} else {
    echo "Not right Token";
}
