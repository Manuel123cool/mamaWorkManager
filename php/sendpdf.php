<?php
include "login.php";

if (validToken()) {
    exec("/your/path/to/file/pdfgen.py");
    $file = "/your/path/to/file/daten.pdf";
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
