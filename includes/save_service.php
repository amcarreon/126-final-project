<?php

require_once '../config/database.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $serviceTitle = $_POST["serviceName"];
    $serviceDescription = $_POST["serviceDescription"];
    $serviceSpecification =  $_POST["serviceSpecification"] ?? [];
    $servicePrice = $_POST["servicePrice"];

    if (!is_array($serviceSpecification)) {
        $serviceSpecification = [$serviceSpecification];
    }
    $count = count($serviceSpecification);

    for ($i = 0; $i < count($serviceSpecification); $i++) {
        $stmt = $conn->prepare("
            INSERT INTO laundry_services (title, service_description, service_specification, service_price)
          VALUES (?, ?, ?, ?)
        ");

        $stmt->bind_param("sssd",$serviceTitle, $serviceDescription, $serviceSpecification[$i], $prices[$i]);
    }

    if ($stmt->execute()) {
        echo "Service saved successfully!";
    } else {
        echo "Error: " . $stmt->error;
    }

    $stmt->close();
}

$conn->close();

?>