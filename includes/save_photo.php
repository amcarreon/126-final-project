<?php

session_start();
require_once '../config/database.php';

if (!isset($_SESSION['user_id'])) {
    die("User not logged in");
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $ownerId = $_SESSION['user_id'];

    $stmt = $conn->prepare("SELECT shop_id FROM shops WHERE owner_id = ?");
    if (!$stmt) die($conn->error);

    $stmt->bind_param("i", $ownerId);
    $stmt->execute();

    $result = $stmt->get_result();
    $shop = $result->fetch_assoc();

    if (!$shop) {
        die("No shop found for this user");
    }

    $shopId = $shop['shop_id'];

    $photoPath = null;

    if (isset($_FILES["photoUpload"]) && $_FILES["photoUpload"]["error"] == 0) {

        $uploadDir = "../uploads/shopPhotos/";

        $fileName = time() . "_" . basename($_FILES["photoUpload"]["name"]);
        $targetFile = $uploadDir . $fileName;

        if (move_uploaded_file($_FILES["photoUpload"]["tmp_name"], $targetFile)) {
            $photoPath = "uploads/shopPhotos/" . $fileName;
        } else {
            die("Failed to upload photo.");
        }
    }

    $stmt = $conn->prepare("
        INSERT INTO shop_photos (shop_id, shop_photo)
        VALUES (?, ?)
    ");

    if (!$stmt) die($conn->error);

    $stmt->bind_param("is", $shopId, $photoPath);

    if ($stmt->execute()) {
        header("Location: ../views/seller/shop_profile_manager.html");
        exit;
    } else {
        echo "Error: " . $stmt->error;
    }

    $stmt->close();
}

$conn->close();
?>