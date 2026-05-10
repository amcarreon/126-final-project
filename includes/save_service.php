<?php

require_once '../../config/database.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $serviceTitle = $_POST["serviceName"];
    $serviceDescription = $_POST["serviceDescription"];
    $servicePrice = $_POST["servicePrice"];

    $stmt = $conn->prepare("INSERT INTO laundry_services (title, service_description, service_price)
                            VALUES (?, ?, ?)");
    $stmt->bind_param("sssd", $serviceTitle, $serviceDescription, $itemDescription, $servicePrice);

    if ($stmt->execute()) {
        echo "Service saved successfully!";
    } else {
        echo "Error: " . $stmt->error;
    }

    $stmt->close();
}

$conn->close();

?>