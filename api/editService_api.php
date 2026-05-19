<?php
require_once '../config/database.php';

header("Content-Type: application/json");

$id = $_GET['id'] ?? null;

if (!$id) {
    echo json_encode(["success" => false, "message" => "Missing ID"]);
    exit;
}

$stmt = $conn->prepare("SELECT * FROM laundry_services WHERE id = ?");
$stmt->bind_param("i", $id);
$stmt->execute();

$result = $stmt->get_result();
$data = $result->fetch_assoc();

echo json_encode([
    "success" => true,
    "data" => $data
]);

