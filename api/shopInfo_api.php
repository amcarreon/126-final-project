<?php

require_once '../config/database.php';

header("Content-Type: application/json");

// Handle GET request (load data)
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (!isset($_GET['id'])) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "Shop ID is required"
        ]);
        exit;
    }

    $id = intval($_GET['id']);

    $sql = "SELECT id, shop_name, shop_desc, contact_info, social_media, shop_location, logo FROM shops WHERE id=?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $id);
    $stmt->execute();

    $result = $stmt->get_result();
    $shop = $result->fetch_assoc();

    if (!$shop) {
        http_response_code(404);
        echo json_encode([
            "success" => false,
            "message" => "Shop not found"
        ]);
        exit;
    }

    echo json_encode([
        "success" => true,
        "data" => $shop
    ]);
}

// Handle POST request (save data)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $shopId = $_POST['shopId'] ?? null;
    $shopName = $_POST['shopName'] ?? '';
    $shopDescription = $_POST['shopDescription'] ?? '';
    $contactInfo = $_POST['contactInfo'] ?? '';
    $socialMediaProfiles = $_POST['socialMediaProfiles'] ?? '';
    $location = $_POST['location'] ?? '';
    $photoUpload = $_FILES['photoUpload'] ?? null;

    if (!$shopId || !$shopName || !$contactInfo || !$location) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "Missing required fields"
        ]);
        exit;
    }

    $logoPath = null;

    if ($photoUpload && $photoUpload['error'] === UPLOAD_ERR_OK) {
        $uploadDir = '../uploads/logos/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }
        
        $fileName = time() . '_' . basename($photoUpload['name']);
        $uploadPath = $uploadDir . $fileName;
        
        if (move_uploaded_file($photoUpload['tmp_name'], $uploadPath)) {
            $logoPath = 'uploads/logos/' . $fileName;
        }
    }

    $sql = "UPDATE shops SET shop_name=?, shop_desc=?, contact_info=?, social_media=?, shop_location=?";
    $params = [$shopName, $shopDescription, $contactInfo, $socialMediaProfiles, $location];
    $types = "sssss";

    if ($logoPath) {
        $sql .= ", logo=?";
        $params[] = $logoPath;
        $types .= "s";
    }

    $sql .= " WHERE id=?";
    $params[] = $shopId;
    $types .= "i";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param($types, ...$params);

    if ($stmt->execute()) {
        echo json_encode([
            "success" => true,
            "message" => "Shop profile updated successfully"
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "message" => "Database update failed"
        ]);
    }
}

$conn->close();
?>