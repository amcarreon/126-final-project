<?php

session_start();
require_once '../config/database.php';

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    exit;
}

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    exit("Unauthorized");
}

$ownerId = $_SESSION['user_id'];
$shopName = trim($_POST['shopName'] ?? '');
$shopDesc = trim($_POST['shopDescription'] ?? '');
$location = trim($_POST['location'] ?? '');

$check = $conn->prepare("SELECT shop_id, logo FROM shops WHERE owner_id = ?");
$check->bind_param("i", $ownerId);
$check->execute();
$result = $check->get_result();
$shop = $result->fetch_assoc();
$check->close();

if (!$shop) {
  $insert = $conn->prepare(
      "INSERT INTO shops (owner_id, shop_name, shop_desc, location, logo) VALUES (?, ?, ?, ?, ?)"
  );
  $logoPath = null;
  $insert->bind_param("issss", $ownerId, $shopName, $shopDesc, $location, $logoPath);
  if ($insert->execute()) {
      header("Location: ../views/seller/shop_profile_manager.html");
      exit;
  }
  exit("Insert failed: " . $insert->error);
}

$shopId = (int) $shop['shop_id'];
$currentLogo = $shop['logo'];
$logoPath = $currentLogo;

if (isset($_FILES["photoUpload"]) && $_FILES["photoUpload"]["error"] === 0) {
    $uploadDir = "../uploads/logos/";

    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    $allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!in_array($_FILES["photoUpload"]["type"], $allowedTypes, true)) {
        exit("Invalid image type");
    }

    $extension = pathinfo($_FILES["photoUpload"]["name"], PATHINFO_EXTENSION);
    $fileName = uniqid("logo_", true) . "." . $extension;
    $targetFile = $uploadDir . $fileName;

    if (move_uploaded_file($_FILES["photoUpload"]["tmp_name"], $targetFile)) {
        $logoPath = "uploads/logos/" . $fileName;
    } else {
        exit("Logo upload failed");
    }
}

$stmt = $conn->prepare(
    "UPDATE shops SET shop_name = ?, shop_desc = ?, location = ?, logo = ?
     WHERE shop_id = ? AND owner_id = ?"
);
$stmt->bind_param("ssssii", $shopName, $shopDesc, $location, $logoPath, $shopId, $ownerId);

if (!$stmt->execute()) {
    exit("Update failed: " . $stmt->error);
}
$stmt->close();

$deleteContacts = $conn->prepare("DELETE FROM contact_info WHERE shop_id = ?");
$deleteContacts->bind_param("i", $shopId);
$deleteContacts->execute();
$deleteContacts->close();

$contactInfo = $_POST['contactInfo'] ?? [];
$contactStmt = $conn->prepare("INSERT INTO contact_info (shop_id, contact_info) VALUES (?, ?)");
foreach ($contactInfo as $info) {
    $info = trim($info);
    if ($info !== '') {
        $contactStmt->bind_param("is", $shopId, $info);
        $contactStmt->execute();
    }
}
$contactStmt->close();

$deleteSocial = $conn->prepare("DELETE FROM social_media WHERE shop_id = ?");
$deleteSocial->bind_param("i", $shopId);
$deleteSocial->execute();
$deleteSocial->close();

$platforms = $_POST['socialMediaPlatform'] ?? [];
$links = $_POST['socialMediaLink'] ?? [];
$socialStmt = $conn->prepare("INSERT INTO social_media (shop_id, platform, link) VALUES (?, ?, ?)");
for ($i = 0; $i < count($platforms); $i++) {
    $platform = trim($platforms[$i] ?? '');
    $link = trim($links[$i] ?? '');
    if ($platform !== '' && $link !== '') {
        $socialStmt->bind_param("iss", $shopId, $platform, $link);
        $socialStmt->execute();
    }
}
$socialStmt->close();

header("Location: ../views/seller/shop_info.html");
exit;
