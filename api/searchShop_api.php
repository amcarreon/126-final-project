<?php
require_once '../config/database.php';

header("Content-Type: application/json");

$searchInput = $_GET['searchInput'] ?? '';

try {

    $search = "%" . $keyword . "%";

    $stmt = $conn->prepare("SELECT shop_id, shop_name, shop_desc, location, logo FROM shops
        WHERE shop_name LIKE ? ORDER BY shop_name ASC");
    
    $stmt->bind_param("s", $search);
    $stmt->execute();
    $result = $stmt->get_result();
    }
    
    $shops = [];
    while ($row = $result->fetch_assoc()) {
        $shops[] = $row;
    }

    echo json_encode([
        "status" => "success",
        "count" => count($shops),
        "data" => $shops
    ]); catch (Exception $e) {
        echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
    }


    $stmt->close();
?>