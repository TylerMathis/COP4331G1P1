<?php
    foreach(glob("*.html") as $filename) {
        include $filename;
    }
    foreach (glob("LAMPAPI/*.php") as $filename) {
        include $filename;
    }
    foreach (glob("LAMPAPI/Error/*.php") as $filename) {
        include $filename;
    }
    foreach (glob("LAMPAPI/model/*.php") as $filename) {
        include $filename;
    }
    foreach (glob("js/*.js") as $filename) {
        include $filename;
    }
    foreach (glob("js/*.js") as $filename) {
        include $filename;
    }
?>
