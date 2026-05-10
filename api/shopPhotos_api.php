<?php
require_once '../config/database.php';

header("Content-Type: application/json");

$shopName = $_GET['shop_name'] ?? null;

try {
        $stmt = $conn->prepare("SELECT id, shop_name, photoPath FROM shop_photos WHERE shop_name = ? ORDER BY id DESC");
        $stmt->bind_param("s", $shopName);

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
?>