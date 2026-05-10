<?php

require_once '../config/database.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $shopName = $_POST["shopName"];
    $shopDesc = $_POST["shopDescription"];
    $contactInfo = $_POST["contactInfo"];
    $socialMedia = $_POST["socialMediaProfiles"];
    $location = $_POST["addressRegion"];
    $logoPath = null;

    if (isset($_FILES["photoUpload"]) && $_FILES["photoUpload"]["error"] == 0) {

        $uploadDir = "../uploads/logos/";

        $fileName = time() . "_" . basename($_FILES["photoUpload"]["name"]);
        $targetFile = $uploadDir . $fileName;

        if (move_uploaded_file($_FILES["photoUpload"]["tmp_name"], $targetFile)) {
                $logoPath = "uploads/logos/" . $fileName;
            } else {
                die("Failed to upload logo.");
            }
    }

    $stmt = $conn->prepare("INSERT INTO shops (shop_name, shop_desc, contact_info, social_media, location, logo)
        VALUES (?, ?, ?, ?, ?, ?)");

    $stmt->bind_param("ssssss", $shopName, $shopDesc, $contactInfo, $socialMedia, $location, $logoPath);

    if ($stmt->execute()) {
        echo "Shop added successfully!";
    } else {
        echo "Error: " . $stmt->error;
    }

    $stmt->close();
}

$conn->close();

?>