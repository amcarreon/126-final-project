<?php
require_once '../config/database.php';

header("Content-Type: application/json");

$searchInput = $_GET['searchInput'] ?? '';

try {

    $search = "%" . $searchInput . "%";

    $stmt = $conn->prepare("
        SELECT shop_id, shop_name, shop_desc, location, logo
        FROM shops
        WHERE shop_name LIKE ?
        ORDER BY shop_name ASC
    ");

    if (!$stmt) {
        throw new Exception("Prepare failed: " . $conn->error);
    }

    $stmt->bind_param("s", $search);
    $stmt->execute();

    $result = $stmt->get_result();

    $shops = [];

    while ($row = $result->fetch_assoc()) {
        $shops[] = $row;
    }

    echo json_encode([
        "status" => "success",
        "count" => count($shops),
        "data" => $shops
    ]);

    $stmt->close();
    $conn->close();

} catch (Exception $e) {

    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
}
?>