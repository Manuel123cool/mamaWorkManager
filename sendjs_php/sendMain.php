<?php
include "login.php";

if (validToken()) {
        header('Content-Type: text/javascript');
        echo file_get_contents('/home/manuel/secret_js/main.js');
} else {
    echo "Not right Token";
}  
