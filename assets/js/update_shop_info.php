<?php

session_start();
require_once '../config/database.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    if (!isset($_SESSION['user_id'])) {
        http_response_code(401);
        exit("Unauthorized");
    }

    $serviceId = $_POST['service_id'] ?? null;
    $serviceName = trim($_POST['serviceName']);
    $serviceDescription = trim($_POST['serviceDescription']);
    $serviceSpec = trim($_POST['serviceSpecification']);
    $servicePrice = (float)($_POST['servicePrice']);

    if (!$serviceId) {
        exit("Service ID required");
    }

    $check->close();

    $stmt = $conn->prepare("UPDATE laundry_services SET title = ?, service_description = ?, service_specification = ?, service_price = ?
        WHERE id = ?");

    $stmt->bind_param("sssdi", $serviceName, $serviceDescription, $serviceSpec, $servicePrice, $serviceId);

    if ($stmt->execute()) {
        echo "Service updated successfully!";
    } else {
        echo "Update failed: " . $stmt->error;
    }

    $stmt->close();
}

$conn->close();

?>