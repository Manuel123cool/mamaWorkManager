<?php
include "login.php";

if (isset($_GET["data"]) && validToken()) {
    if ($_GET["data"] == "false") {
        exit();
    }
    $path = "/home/manuel/xampp_files/data.txt";
    $data = file_get_contents($path);
    if($data == false || empty($data)) {
        echo "Could not get Data";
    }
    echo $data;
} else {
    echo "Not right Token";
}
