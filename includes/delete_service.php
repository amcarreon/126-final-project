<?php

session_start();
require_once '../config/database.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    if (!isset($_SESSION['user_id'])) {
        http_response_code(401);
        exit("Unauthorized");
    }

    $serviceId = $_POST['service_id'] ?? null;
    $ownerId = $_SESSION['user_id'];

    if (!$serviceId) {
        exit("Service ID required");
    }

    $stmt = $conn->prepare("DELETE FROM laundry_services WHERE id = ?");
    $stmt->bind_param("i", $serviceId);

    if ($stmt->execute()) {
        echo "Service permanently deleted.";
    } else {
        echo "Delete failed: " . $stmt->error;
    }

    $stmt->close();
}

$conn->close();

?>