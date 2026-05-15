<?php

session_start();
require_once '../config/database.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $photoPath = null;

    $ownerId = $_SESSION['user_id'];
    $stmt = $conn->prepare("SELECT shop_id FROM shops WHERE owner_id = ?");
    $stmt->bind_param("i", $ownerId);
    $stmt->execute();

    $result = $stmt->get_result();
    $shop = $result->fetch_assoc();

    if (!$shop) {
        die("No shop found for this user");
    }

    $shopId = $shop['shop_id'];

    if (isset($_FILES["photoUpload"]) && $_FILES["photoUpload"]["error"] == 0) {

        $uploadDir = "../uploads/shopPhotos/";

        $fileName = time() . "_" . basename($_FILES["photoUpload"]["name"]);
        $targetFile = $uploadDir . $fileName;

        if (move_uploaded_file($_FILES["photoUpload"]["tmp_name"], $targetFile)) {
                $photoPath = "uploads/shopPhotos/" . $fileName;
            } else {
                die("Failed to upload logo.");
            }
    }

    $stmt = $conn->prepare("INSERT INTO shop_photos(shop_id, shop_photo)
        VALUES (?, ?)");

    $stmt->bind_param("is", $shopName, $photoPath);

    if ($stmt->execute()) {
        echo "Shop photo added successfully!";
    } else {
        echo "Error: " . $stmt->error;
    }

    $stmt->close();
}

$conn->close();

?>