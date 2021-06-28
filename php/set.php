<?php
include "login.php";

if (isset($_POST["data"]) && validLoginData()) {
    $path = "/home/manuel/xampp_files/data.txt";
    if (!file_put_contents($path, $_POST["data"])) {
        echo "Could not set Data";
    }
    exec("/opt/lampp/htdocs/python/backup.py", $out);
} else {
    echo "Not right Token";
}
