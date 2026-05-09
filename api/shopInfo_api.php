<?php

require_once '../config/database.php';

header("Content-Type: application/json");

if (!isset($_GET['id'])) {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Shop ID is required"
    ]);

    exit;
}

$id = intval($_GET['id']);

$sql = "SELECT id, shop_name, shop_desc, contact_info, social_media, location, logo FROM shops WHERE id=?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $id);
$stmt->execute();

$result = $stmt->get_result();

if (!$result) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Database query failed"
    ]);
    exit;
}

$shop = $result->fetch_assoc();

echo json_encode([
    "success" => true,
    "data" => $shop
]);

$conn->close();

?>