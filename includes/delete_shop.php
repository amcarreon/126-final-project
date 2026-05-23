<?php
/**
 * Seller self-delete (soft delete, no reason).
 * Wire from seller UI later with a confirmation dialog before POST.
 */
session_start();
require_once '../config/database.php';

header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
    exit;
}

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "Unauthorized"]);
    exit;
}

$ownerId = (int) $_SESSION['user_id'];

$stmt = $conn->prepare(
    "UPDATE shops SET is_deleted = 1, deleted_at = NOW() WHERE owner_id = ? AND is_deleted = 0"
);
$stmt->bind_param("i", $ownerId);

if ($stmt->execute() && $stmt->affected_rows > 0) {
    echo json_encode(["success" => true, "message" => "Shop deleted successfully"]);
} else {
    http_response_code(404);
    echo json_encode(["success" => false, "message" => "Shop not found or already deleted"]);
}

$stmt->close();
$conn->close();
