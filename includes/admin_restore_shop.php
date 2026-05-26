<?php
require_once '../config/database.php';
require_once 'admin_auth.php';

require_admin_json();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
    exit;
}

$shopId = isset($_POST['shop_id']) ? (int) $_POST['shop_id'] : 0;

if ($shopId <= 0) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Invalid shop_id"]);
    exit;
}

$stmt = $conn->prepare(
    "UPDATE shops
     SET is_deleted = 0, deleted_at = NULL, deletion_reason = NULL
     WHERE shop_id = ? AND is_deleted = 1"
);
$stmt->bind_param("i", $shopId);

if ($stmt->execute() && $stmt->affected_rows > 0) {
    echo json_encode(["success" => true, "message" => "Shop restored successfully"]);
} else {
    http_response_code(404);
    echo json_encode(["success" => false, "message" => "Shop not found or not deleted"]);
}

$stmt->close();
$conn->close();
