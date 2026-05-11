<?php

session_start();
require_once '../config/database.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    if (!isset($_SESSION['user_id'])) {
        die("Unauthorized");
    }

    $ownerId = $_SESSION['user_id'];
    $stmt = $conn->prepare("SELECT id FROM shops WHERE owner_id = ?");
    $stmt->bind_param("i", $ownerId);
    $stmt->execute();

    $result = $stmt->get_result();
    $shop = $result->fetch_assoc();

    if (!$shop) {
        die("No shop found for this user");
    }

    $shopId = $shop['id'];
    $serviceTitle = $_POST["serviceName"];
    $serviceDescription = $_POST["serviceDescription"];
    $serviceSpecification = $_POST["serviceSpecification"] ?? [];
    $servicePrice = $_POST["servicePrice"] ?? [];

    if (!is_array($serviceSpecification)) {
        $serviceSpecification = [$serviceSpecification];
    }

    if (!is_array($servicePrice)) {
        $servicePrice = [$servicePrice];
    }

    $stmt = $conn->prepare("INSERT INTO laundry_services(shop_id, title, service_description, service_specification, service_price)
        VALUES (?, ?, ?, ?, ?)");

    if (!$stmt) {
        die("Prepare failed: " . $conn->error);
    }

    for ($i = 0; $i < count($serviceSpecification); $i++) {

        $spec = $serviceSpecification[$i];
        $price = $servicePrice[$i] ?? 0;

        $stmt->bind_param("isssd", $shopId, $serviceTitle, $serviceDescription, $spec, $price);

        if (!$stmt->execute()) {
            echo "Error inserting row $i: " . $stmt->error;
        }
    }

    echo "Service saved successfully!";

    $stmt->close();
}

$conn->close();
?>