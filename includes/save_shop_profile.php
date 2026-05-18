<?php

require_once '../../config/database.php';
require_once __DIR__ . '/../api/geocode_api.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $shopName = $_POST["shopName"];
    $shopDesc = $_POST["shopDesc"];
    $contactInfo = $_POST["contactInfo"];
    $socialMedia = $_POST["socialMedia"];
    $location = null;
    $logoPath = null;

    // Location validation before inserting to database
    if (isset($_POST["location"]) && !empty($_POST["location"])) {
        $validLoc = getValidAddress($loc, null, null); 
        $location = $validLoc['formatted_address'];
    }

    if (isset($_FILES["logo"]) && $_FILES["logo"]["error"] == 0) {

        $uploadDir = "../../uploads/logos/";

        $fileName = time() . "_" . basename($_FILES["logo"]["name"]);
        $targetFile = $uploadDir . $fileName;

        if (move_uploaded_file($_FILES["logo"]["tmp_name"], $targetFile)) {
                $logoPath = "uploads/logos/" . $fileName;
            } else {
                die("Failed to upload logo.");
            }
    }

    $stmt = $conn->prepare("INSERT INTO shops (shop_name, shop_desc, contact_info, social_media, shop_location, logo)
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