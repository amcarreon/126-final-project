<?php

session_start();
require_once '../config/database.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    if (!isset($_SESSION['user_id'])) {
        http_response_code(401);
        exit("Unauthorized");
    }

    $ownerId = $_SESSION['user_id'];

    $shopName = trim($_POST['shopName']);
    $shopDesc = trim($_POST['shopDescription']);
    $location = trim($_POST['location']);

    $logoPath = null;

    $check = $conn->prepare("SELECT shop_id, logo FROM shops 
        WHERE owner_id = ?");

    $check->bind_param("i", $ownerId);
    $check->execute();

    $result = $check->get_result();
    $shop = $result->fetch_assoc();

    if (!$shop) {
        $insert = $conn->prepare("INSERT INTO shops (owner_id, shop_name, shop_desc, location, logo)
        VALUES (?, ?, ?, ?, ?)");

    $insert->bind_param("issss", $ownerId, $shopName, $shopDesc, $location, $logoPath);

    if ($insert->execute()) {
        header("Location: ../views/seller/shop_profile_manager.html");
        exit;
    } else {
        exit("Insert failed: " . $insert->error);
    }
    }

    $shopId = $shop['shop_id'];
    $currentLogo = $shop['logo'];

    $check->close();

    if (isset($_FILES["photoUpload"]) && $_FILES["photoUpload"]["error"] === 0) {

        $uploadDir = "../uploads/logos/";

        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }

        $allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

        if (!in_array($_FILES["photoUpload"]["type"], $allowedTypes)) {
            exit("Invalid image type");
        }

        $fileName = uniqid("logo_", true) . "." . pathinfo($_FILES["photoUpload"]["name"], PATHINFO_EXTENSION);

        $targetFile = $uploadDir . $fileName;

        if (move_uploaded_file($_FILES["photoUpload"]["tmp_name"], $targetFile)) {

            $logoPath = "uploads/logos/" . $fileName;

        } else {
            exit("Logo upload failed");
        }
    }

    if ($logoPath === null) {
        $logoPath = $currentLogo;
    }

    $stmt = $conn->prepare("UPDATE shops SET shop_name = ?, shop_desc = ?, location = ?, logo = ?
        WHERE shop_id = ? AND owner_id = ?");

    $stmt->bind_param("ssssii", $shopName, $shopDesc, $location, $logoPath, $shopId, $ownerId);

    if ($stmt->execute()) {
        header("Location: ../views/seller/shop_info.html");
        exit;
    } else {
        echo "Update failed: " . $stmt->error;
    }

    $stmt->close();
}

$conn->close();

?>