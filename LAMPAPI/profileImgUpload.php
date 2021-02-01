<?php
$filename = basename($_FILES["fileToUpload"]["name"]);
$savePath = "../contact-imgs/" . $filename;
move_uploaded_file($_FILES["fileToUpload"]["tmp_name"], $savePath);