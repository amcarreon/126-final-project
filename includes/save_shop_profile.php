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
    $location = $_POST["location"];
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


    $stmt = $conn->prepare("INSERT INTO shops (owner_id, shop_name, shop_desc, contact_info, location, logo)
        VALUES (?, ?, ?, ?, ?, ?)");

    $stmt->bind_param("isssss",$ownerId, $shopName, $shopDesc, $contactInfo, $location, $logoPath);

    if ($stmt->execute()) {
        echo "Shop added successfully!";
    } else {
        echo "Error: " . $stmt->error;
    }

    $stmt->close();

    $ownerId = $_SESSION['user_id'];

    $stmt = $conn->prepare("SELECT shop_id FROM shops WHERE owner_id = ?");
    $stmt->bind_param("i", $ownerId);
    $stmt->execute();

    $result = $stmt->get_result();
    $row = $result->fetch_assoc();

    $shopId = $row['shop_id'];
    $stmt->close();

    $socialMediaList = $_POST['contactInfo[]'] ?? [];

    if (!is_array($socialMediaList)) {
        $socialMediaList = [$socialMediaList];
    }

    $stmt = $conn->prepare("INSERT INTO social_media (shop_id, soc_med) VALUES (?, ?)");

    foreach ($socialMediaList as $socialMedia) {
        $stmt->bind_param("is", $shopId, $socialMedia);
        $stmt->execute();
    }

    $stmt->close();
}

$conn->close();

?>