<?php
session_start();
$password = "";

function validLoginData() {
    return validSession() && validIpAddress() && validCookie();
}

function getLine($lineCount) {
    $path = "/home/manuel/server_data/login_data.txt";
    $handle = fopen($path, "r");
    if ($handle) {
        $count = 0;
        while (($line = fgets($handle)) !== false) {
            if ($count == $lineCount) {
		return $line;
            }
            $count++;
        }
        fclose($handle);
    } else {
        echo "Could not get login data";
    }
}

function validCookie() {
    global $password;
    $token = getLine(1);
    $token = @openssl_decrypt($token, "aes-256-ctr", $password);
    if (!isset($_COOKIE["token"])) {
        return false;
    }
    if (hash_equals($token, $_COOKIE["token"])) {
        return true;
    }
    return false;
}

 function validSession() {
    global $password;
    $token = getLine(0);
    $token = @openssl_decrypt($token, "aes-256-ctr", $password);
    if (!isset($_SESSION["token"])) {
        return false;
    }
    if (hash_equals($token, $_SESSION["token"])) {
        return true;
    }
    return false;
}

function validIpAddress() {
    global $password;
    $ipAddress = getLine(2);
    $ipAddress = @openssl_decrypt($ipAddress, "aes-256-ctr", $password);
    if (hash_equals(getIpAddress(), $ipAddress)) {
        return true;
    }
    return false;
}

function getIpAddress() {
    //whether ip is from share internet
    if (!empty($_SERVER['HTTP_CLIENT_IP']))
    {
        $ip_address = $_SERVER['HTTP_CLIENT_IP'];
    }
    //whether ip is from proxy
    elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR']))
    {
        $ip_address = $_SERVER['HTTP_X_FORWARDED_FOR'];
    }
    //whether ip is from remote address
    else
    {
        $ip_address = $_SERVER['REMOTE_ADDR'];
    }
    return $ip_address;
}

function setupLoginData() {
    global $password;
    $tokenSession = bin2hex(openssl_random_pseudo_bytes(25));
    $tokenCookie = bin2hex(openssl_random_pseudo_bytes(25));
    $ipAddress = getIpAddress();
    $cipher = "aes-256-ctr";
    $encryptedSession = @openssl_encrypt($tokenSession, $cipher, $password);
    $encryptedCookie = @openssl_encrypt($tokenCookie, $cipher, $password);
    $encryptedIpAddress = @openssl_encrypt($ipAddress, $cipher, $password);

    $_SESSION["token"] = $tokenSession;
    setcookie("token", $tokenCookie, NULL, "/", NULL, TRUE, TRUE);

    $path = "/home/manuel/server_data/login_data.txt";
    file_put_contents($path, "");
    $file = fopen($path,"a",1);
    fwrite($file, $encryptedSession . PHP_EOL);
    fwrite($file, $encryptedCookie . PHP_EOL);
    fwrite($file, $encryptedIpAddress . PHP_EOL);
    fclose($file);
}

function countTries() {
    $path = "/home/manuel/server_data/tries.txt";
    $tries = file_get_contents($path);
    $tries = (int)$tries;
    if ($tries > 10) {
        return false;
    }
    return true;
}

function addTry() {
    $path = "/home/manuel/server_data/tries.txt";
    $tries = file_get_contents($path);
    $tries = (int)$tries;
    file_put_contents($path, strval($tries + 1));
}

if (isset($_POST["name"], $_POST["password"])) {
    if (hash_equals("", $_POST["name"]) && 
	hash_equals($password, $_POST["password"])) {
        if (countTries()) {
            setupLoginData();
            echo "went fine";
        }
    } else {
        addTry();
        echo "somenthing went wrong";
    }
}
