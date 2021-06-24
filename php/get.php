<?php
include "login.php";

if (isset($_GET["data"]) && validToken()) {
    $path = "/home/manuel/xampp_files/data.txt";
    $data = file_get_contents($path);
    echo $data;
} else {
    echo "Not right Token";
}
