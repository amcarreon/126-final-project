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

$sql = "SELECT id, shop_name, shop_desc, contact_info, social_media, location, logo 
        FROM shops WHERE owner_id = ?";

$stmt = $conn->prepare($sql);

if (!$stmt) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Failed to prepare statement"
    ]);
    exit;
}

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

echo json_encode([
    "success" => true,
    "data" => $shop
]);

$stmt->close();
$conn->close();
?>