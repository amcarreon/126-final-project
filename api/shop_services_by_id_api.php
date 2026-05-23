<?php
require_once '../config/database.php';
require_once '../includes/admin_auth.php';

header("Content-Type: application/json");

admin_session_start();

$shopId = isset($_GET['shop_id']) ? (int) $_GET['shop_id'] : 0;
$isAdmin = is_admin_logged_in();

if ($shopId <= 0) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Invalid shop_id"]);
    exit;
}

if (!$isAdmin) {
    $check = $conn->prepare("SELECT shop_id FROM shops WHERE shop_id = ? AND is_deleted = 0");
    $check->bind_param("i", $shopId);
    $check->execute();
    if (!$check->get_result()->fetch_assoc()) {
        http_response_code(404);
        echo json_encode(["success" => false, "message" => "Shop not found"]);
        exit;
    }
    $check->close();
}

$stmt = $conn->prepare(
    "SELECT id, title, service_description, service_specification, service_price
     FROM laundry_services WHERE shop_id = ?"
);
$stmt->bind_param("i", $shopId);
$stmt->execute();
$result = $stmt->get_result();

$data = [];
while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode(["success" => true, "data" => $data]);

$stmt->close();
$conn->close();
