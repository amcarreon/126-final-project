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
$reason = trim($_POST['deletion_reason'] ?? '');

if ($shopId <= 0) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Invalid shop_id"]);
    exit;
}

if ($reason === '') {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Deletion reason is required"]);
    exit;
}

$stmt = $conn->prepare(
    "UPDATE shops
     SET is_deleted = 1, deleted_at = NOW(), deletion_reason = ?
     WHERE shop_id = ? AND is_deleted = 0"
);
$stmt->bind_param("si", $reason, $shopId);

if ($stmt->execute() && $stmt->affected_rows > 0) {
    echo json_encode(["success" => true, "message" => "Shop deleted successfully"]);
} else {
    http_response_code(404);
    echo json_encode(["success" => false, "message" => "Shop not found or already deleted"]);
}

$stmt->close();
$conn->close();
