<?php
include "login.php";

if (validLoginData()) {
    exec("/home/manuel/python/pdfgen.py");
    $file = "/home/manuel/server_data/daten.pdf";
    header('Content-Description: File Transfer');
    header('Content-Type: application/pdf');
    header('Content-Disposition: attachment; filename='.basename($file));
    header('Content-Transfer-Encoding: binary');
    header('Expires: 0');
    header('Cache-Control: must-revalidate');
    header('Pragma: public');
    flush();
    readfile($file);
} else {
    echo "Not right Token";
}
