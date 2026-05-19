<?php

session_start();
require_once '../config/database.php';

header("Content-Type: application/json");

if (!isset($_SESSION['user_id'])) {
    echo json_encode([
        "success" => false,
        "message" => "Unauthorized"
    ]);
    exit;
}

$ownerId = $_SESSION['user_id'];

$stmt = $conn->prepare("SELECT shop_id, shop_name, shop_desc, location, logo FROM shops
    WHERE owner_id = ? LIMIT 1");

$stmt->bind_param("i", $ownerId);
$stmt->execute();

$result = $stmt->get_result();
$shop = $result->fetch_assoc();

$shopId = $shop['shop_id'];

/* CONTACTS */
$contacts = [];
$cStmt = $conn->prepare("
    SELECT contact_info
    FROM contact_info
    WHERE shop_id = ?
");

$cStmt->bind_param("i", $shopId);
$cStmt->execute();
$cResult = $cStmt->get_result();

while ($row = $cResult->fetch_assoc()) {
    $contacts[] = $row['contact_info'];
}


$social = [];
$sStmt = $conn->prepare("
    SELECT platform, link
    FROM social_media
    WHERE shop_id = ?
");

$sStmt->bind_param("i", $shopId);
$sStmt->execute();
$sResult = $sStmt->get_result();

while ($row = $sResult->fetch_assoc()) {
    $social[] = $row;
}


echo json_encode([
    "success" => true,
    "data" => $shop,
    "contacts" => $contacts,
    "social_media" => $social
]);

$stmt->close();
$conn->close();