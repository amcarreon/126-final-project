<?php
session_start();
require_once '../config/database.php';

header("Content-Type: application/json");

$ownerId = $_SESSION['user_id'];

$stmt = $conn->prepare("SELECT id, title, service_description, service_specification, service_price FROM laundry_services
    WHERE shop_id = (
        SELECT shop_id FROM shops WHERE owner_id = ?
    )
");

$stmt->bind_param("i", $ownerId);
$stmt->execute();

$result = $stmt->get_result();

$data = [];

while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode([
    "success" => true,
    "data" => $data
]);
?>