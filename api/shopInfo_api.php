<?php
session_start();
require_once '../config/database.php';

header("Content-Type: application/json");

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode([
        "success" => false,
        "message" => "Unauthorized"
    ]);
    exit;
}

$ownerId = $_SESSION['user_id'];


$stmt = $conn->prepare("SELECT shop_id, shop_name, shop_desc, location, logo 
                        FROM shops 
                        WHERE owner_id = ?");

$stmt->bind_param("i", $ownerId);
$stmt->execute();

$result = $stmt->get_result();
$shop = $result->fetch_assoc();

if (!$shop) {
    http_response_code(404);
    echo json_encode([
        "success" => false,
        "message" => "Shop not found"
    ]);
    exit;
}

$shopId = $shop['shop_id'];


$contacts = [];
$stmt2 = $conn->prepare("SELECT contact_info FROM contact_info WHERE shop_id = ?");
$stmt2->bind_param("i", $shopId);
$stmt2->execute();
$res2 = $stmt2->get_result();

while ($row = $res2->fetch_assoc()) {
    $contacts[] = $row;
}

$social = [];
$stmt3 = $conn->prepare("SELECT platform, link FROM social_media WHERE shop_id = ?");
$stmt3->bind_param("i", $shopId);
$stmt3->execute();
$res3 = $stmt3->get_result();

while ($row = $res3->fetch_assoc()) {
    $social[] = $row;
}


echo json_encode([
    "success" => true,
    "data" => [
        "shop_id" => $shopId,
        "shop_name" => $shop['shop_name'],
        "shop_desc" => $shop['shop_desc'],
        "location" => $shop['location'],
        "logo" => $shop['logo'],
        "contacts" => $contacts,
        "socialMedia" => $social
    ]
]);

$conn->close();
?>