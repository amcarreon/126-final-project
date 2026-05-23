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
$adminId = get_admin_id();

if ($shopId <= 0 || $adminId <= 0) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Invalid request"]);
    exit;
}

$stmt = $conn->prepare(
    "UPDATE shops
     SET is_reviewed = 1, reviewed_at = NOW(), reviewed_by = ?
     WHERE shop_id = ? AND is_deleted = 0"
);
$stmt->bind_param("ii", $adminId, $shopId);

if ($stmt->execute() && $stmt->affected_rows > 0) {
    echo json_encode(["success" => true, "message" => "Shop marked as reviewed"]);
} else {
    http_response_code(404);
    echo json_encode(["success" => false, "message" => "Shop not found or already deleted"]);
}

$stmt->close();
$conn->close();
