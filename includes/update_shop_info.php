<?php

session_start();
require_once '../config/database.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    if (!isset($_SESSION['user_id'])) {
        http_response_code(401);
        exit("Unauthorized");
    }

    $ownerId = $_SESSION['user_id'];

    $shopName = trim($_POST['shop_name']);
    $shopDesc = trim($_POST['shop_desc']);
    $location = trim($_POST['location']);

    $logoPath = null;

    $check = $conn->prepare("SELECT shop_id, logo FROM shops 
        WHERE owner_id = ?");

    $check->bind_param("i", $ownerId);
    $check->execute();

    $result = $check->get_result();
    $shop = $result->fetch_assoc();

    if (!$shop) {
        exit("No shop found for this user");
    }

    $shopId = $shop['shop_id'];
    $currentLogo = $shop['logo'];

    $check->close();

    if (isset($_FILES["logo"]) && $_FILES["logo"]["error"] === 0) {

        $uploadDir = "../uploads/logos/";

        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }

        $allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

        if (!in_array($_FILES["logo"]["type"], $allowedTypes)) {
            exit("Invalid image type");
        }

        $fileName = uniqid("logo_", true) . "." . pathinfo($_FILES["logo"]["name"], PATHINFO_EXTENSION);

        $targetFile = $uploadDir . $fileName;

        if (move_uploaded_file($_FILES["logo"]["tmp_name"], $targetFile)) {

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
        echo "Shop updated successfully.";
    } else {
        echo "Update failed: " . $stmt->error;
    }

    $stmt->close();
}

$conn->close();

?>