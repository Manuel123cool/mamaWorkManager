<?php
include "login.php";

if (isset($_POST["data"]) && validToken()) {
    $path = "/home/manuel/xampp_files/data.txt";
    file_put_contents($path, $_POST["data"]);
    exec("/opt/lampp/htdocs/python/backup.py", $out);
} else {
    echo "Not right Token";
}
