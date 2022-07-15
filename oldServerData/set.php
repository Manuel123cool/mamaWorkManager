<?php
include "login.php";

if (isset($_POST["data"]) && validLoginData()) {
    $path = "/home/manuel/server_data/data.txt";
    file_put_contents($path, $_POST["data"]);
    if (!file_put_contents($path, $_POST["data"])) {
        echo "Could not set Data";
    }
    exec("/home/manuel/python/backup.py", $out);
} else {
    echo "Not right Token";
}
