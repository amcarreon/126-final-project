<?php

session_start();
require_once '../config/database.php';

header("Content-Type: application/json");

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

    if (!$serviceId) {
        echo json_encode([
            "success" => false,
            "message" => "Service ID required"
        ]);
        exit;
    }

    $serviceName = trim($_POST['serviceName'] ?? '');
    $serviceDescription = trim($_POST['serviceDescription'] ?? '');
    $serviceSpec = trim($_POST['serviceSpecification'] ?? '');
    $servicePrice = $_POST['servicePrice'] ?? 0;

    /* OPTIONAL: verify ownership */
    $ownerId = $_SESSION['user_id'];

    $check = $conn->prepare("
        SELECT ls.id 
        FROM laundry_services ls
        JOIN shops s ON ls.shop_id = s.shop_id
        WHERE ls.id = ? AND s.owner_id = ?
    ");
    $check->bind_param("ii", $serviceId, $ownerId);
    $check->execute();

    $result = $check->get_result();

    if ($result->num_rows === 0) {
        echo json_encode([
            "success" => false,
            "message" => "Service not found or not yours"
        ]);
        exit;
    }

    $check->close();

    $stmt = $conn->prepare("UPDATE laundry_services SET title = ?, service_description = ?, service_specification = ?, service_price = ?
        WHERE id = ?");

    $stmt->bind_param(
        "sssdi",
        $serviceName,
        $serviceDescription,
        $serviceSpec,
        $servicePrice,
        $serviceId
    );

    if ($stmt->execute()) {
        header("Location: ../views/seller/services_page.html");
    exit;
    } else {
        echo json_encode([
        "success" => false,
        "message" => $stmt->error]);
    }
    $stmt->close();
}

$conn->close();