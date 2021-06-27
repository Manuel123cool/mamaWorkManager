<?php
session_start();

function validToken() {
    $path = "/home/manuel/xampp_files/token.txt";
    $token = file_get_contents($path);
    if($token == false || empty($token)) {
        echo "Could not get Token";
    }
    $token = @openssl_decrypt($token, "aes-256-ctr", "Password");
    if (!isset($_SESSION["token"])) {
        return false;
    } 
    if ($_SESSION["token"] === $token) {
        return true;
    }
    return false;
}
