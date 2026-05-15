<?php
header("Content-Type: application/json");

session_start();
require_once '../config/database.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    if (!isset($_SESSION['user_id'])) {
        http_response_code(401);
        echo json_encode([
            "success" => false,
            "message" => "Unauthorized"
        ]);
        exit;
    }

    $serviceId = $_POST['service_id'] ?? null;
    $ownerId = $_SESSION['user_id'];

    if (!$serviceId) {
        echo json_encode([
            "success" => false,
            "message" => "Service ID required"
        ]);
        exit;
    }

    $stmt = $conn->prepare("DELETE FROM laundry_services WHERE id = ?");
    $stmt->bind_param("i", $serviceId);

    if ($stmt->execute()) {
        echo json_encode([
            "success" => true,
            "message" => "Service permanently deleted."
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => $stmt->error
        ]);
    }

    $stmt->close();
}

$conn->close();

?>