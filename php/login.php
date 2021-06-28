<?php
session_start();

function validLoginData() {
    return validSession() && validIpAddress() && validCookie();
}

function validCookie() {
    $path = "/home/manuel/xampp_files/login_data.txt";
    $handle = fopen($path, "r");
    $token = null;
    if ($handle) {
        $count = 0;
        while (($line = fgets($handle)) !== false) {
            if ($count == 1) {
                    $token = $line;
                    break;
            }
            $count++;
        }
        fclose($handle);
    } else {
        echo "Could not get login data";
    }
    $token = @openssl_decrypt($token, "aes-256-ctr", "Password");
    if (!isset($_COOKIE["token"])) {
        return false;
    }
    if ($_COOKIE["token"] === $token) {
        return true;
    }
    return false;
}

 function validSession() {
    $path = "/home/manuel/xampp_files/login_data.txt";
    $handle = fopen($path, "r");
    $token = null;
    if ($handle) {
        $count = 0;
        while (($line = fgets($handle)) !== false) {
            if ($count == 0) {
                $token = $line;
                break;
            }
            $count++;
        }
        fclose($handle);
    } else {
        echo "Could not get login data";
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

function validIpAddress() {
    $path = "/home/manuel/xampp_files/login_data.txt";
    $handle = fopen($path, "r");
    $ipAddress = null;
    if ($handle) {
        $count = 0;
        while (($line = fgets($handle)) !== false) {
                if ($count == 2) {
                    $ipAddress = $line;
                    break;
                }
                $count++;
        }
        fclose($handle);
    } else {
            echo "Could not get login data";
    }
    $ipAddress = @openssl_decrypt($ipAddress, "aes-256-ctr", "Password");
    if ($ipAddress === getIpAddress()) {
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
    $tokenSession = bin2hex(openssl_random_pseudo_bytes(25));
    $tokenCookie = bin2hex(openssl_random_pseudo_bytes(25));
    $ipAddress = getIpAddress();
    $cipher = "aes-256-ctr";
    $encryptedSession = @openssl_encrypt($tokenSession,
            $cipher, "Password");
    $encryptedCookie = @openssl_encrypt($tokenCookie, $cipher, "Password");
    $encryptedIpAddress = @openssl_encrypt($ipAddress, $cipher, "Password");

    $_SESSION["token"] = $tokenSession;
    setcookie("token", $tokenCookie, NULL, "/", NULL, TRUE, TRUE);

    $path = "/home/manuel/xampp_files/login_data.txt";
    file_put_contents($path, "");
    $file = fopen($path,"a",1);
    fwrite($file, $encryptedSession . PHP_EOL);
    fwrite($file, $encryptedCookie . PHP_EOL);
    fwrite($file, $encryptedIpAddress . PHP_EOL);
    fclose($file);
}

function countTries() {
    //* * */1 * * echo "0" > /home/manuel/server_data/tries.txt 1> /dev/null 2> /home/manuel/crontab_status/re_triesTo0.err
    $path = "/home/manuel/xampp_files/tries.txt";
    $tries = file_get_contents($path);
    $tries = (int)$tries;
    if ($tries > 10) {
        return false;
    }
    return true;
}

function addTry() {
    $path = "/home/manuel/xampp_files/tries.txt";
    $tries = file_get_contents($path);
    $tries = (int)$tries;
    file_put_contents($path, $tries + 1); 
}

if (isset($_POST["name"], $_POST["password"])) {
    if ($_POST["name"] === "Name" && $_POST["password"] === "Password") {
        if (countTries()) {
            setupLoginData();
            echo "went fine";
        }
    } else {
        addTry();
        echo "somenthing went wrong";
    }
}

