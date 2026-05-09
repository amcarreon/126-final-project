<?php

require_once '../config/database.php';

header("Content-Type: application/json");

if (!isset($_GET['id'])) {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Service ID is required"
    ]);

    exit;
}

$id = intval($_GET['id']);

$sql = "SELECT id, service_title, service_desc, service_price FROM laundry_services WHERE id=?";
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

$service = $result->fetch_assoc();

echo json_encode([
    "success" => true,
    "data" => $service
]);

$conn->close();

?>