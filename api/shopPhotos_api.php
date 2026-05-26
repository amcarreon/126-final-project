<?php
require_once '../config/database.php';
require_once '../includes/admin_auth.php';

header("Content-Type: application/json");

admin_session_start();

$shopId = isset($_GET['shop_id']) ? (int) $_GET['shop_id'] : 0;
$isAdmin = is_admin_logged_in();

if ($shopId <= 0) {
    echo json_encode(["status" => "error", "message" => "Invalid shop_id"]);
    exit;
}

if (!$isAdmin) {
    $check = $conn->prepare("SELECT shop_id FROM shops WHERE shop_id = ? AND is_deleted = 0");
    $check->bind_param("i", $shopId);
    $check->execute();
    if (!$check->get_result()->fetch_assoc()) {
        echo json_encode(["status" => "error", "message" => "Shop not found"]);
        exit;
    }
    $check->close();
}

try {
    $stmt = $conn->prepare("SELECT id, shop_photo FROM shop_photos WHERE shop_id = ? ORDER BY id DESC");
    $stmt->bind_param("i", $shopId);
    $stmt->execute();
    $result = $stmt->get_result();

    $photos = [];
    while ($row = $result->fetch_assoc()) {
        $photos[] = $row;
    }

    echo json_encode([
        "status" => "success",
        "count" => count($photos),
        "data" => $photos
    ]);

    $stmt->close();
} catch (Exception $e) {
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
}

$conn->close();
