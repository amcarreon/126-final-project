<?php
session_start();
if (!isset($_SESSION['user_id'])) {
    die("User not logged in.");
}

require_once '../config/database.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    $ownerId = $_SESSION['user_id'];
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


    $stmt = $conn->prepare("INSERT INTO shops (owner_id, shop_name, shop_desc, contact_info, social_media, location, logo)
        VALUES (?, ?, ?, ?, ?, ?, ?)");

    $stmt->bind_param("issssss",$ownerId, $shopName, $shopDesc, $contactInfo, $socialMedia, $location, $logoPath);

    if ($stmt->execute()) {
        echo "Shop added successfully!";
    } else {
        echo "Error: " . $stmt->error;
    }

    $stmt->close();
}

$conn->close();

?>