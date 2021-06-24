<?php
session_start();

function validToken() {
    $path = "/home/manuel/xampp_files/token.txt";
    $token = file_get_contents($path);
    $token = @openssl_decrypt($token, "aes-256-ctr", "Password");
    if (!isset($_SESSION["token"])) {
        return false;
    } 
    if ($_SESSION["token"] === $token) {
        return true;
    }
    return false;
}

function setNewToken() {
    $token = bin2hex(openssl_random_pseudo_bytes(16));

    $path = "/home/manuel/xampp_files/token.txt";

    $_SESSION["token"] = $token;

    $cipher = "aes-256-ctr";
    $encryptedToken = @openssl_encrypt($token, $cipher, "Password");
    file_put_contents($path, $encryptedToken);
}

if (isset($_POST["name"], $_POST["password"])) {
    if ($_POST["name"] === "Name" && $_POST["password"] === "Password") {
        setNewToken();
        echo "went fine";
    } else {
        echo "somenthing went wrong";
    }
}


