<?php

session_start();
require_once '../config/database.php';

header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode([
        "success" => false,
        "message" => "User not logged in"
    ]);
    exit;
}

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode([
        "success" => false,
        "message" => "Invalid request method"
    ]);
    exit;
}

$ownerId = $_SESSION['user_id'];

$stmt = $conn->prepare("SELECT shop_id FROM shops WHERE owner_id = ?");
$stmt->bind_param("i", $ownerId);
$stmt->execute();

$result = $stmt->get_result();
$shop = $result->fetch_assoc();

if (!$shop) {
    echo json_encode([
        "success" => false,
        "message" => "No shop found"
    ]);
    exit;
}

$shopId = $shop['shop_id'];


if (!isset($_FILES["photoURL"])) {
    echo json_encode([
        "success" => false,
        "message" => "No file received"
    ]);
    exit;
}

$file = $_FILES["photoURL"];

if ($file["error"] !== 0) {
    echo json_encode([
        "success" => false,
        "message" => "Upload error code: " . $file["error"]
    ]);
    exit;
}

$uploadDir = __DIR__ . "/../uploads/shopPhotos/";

if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

$extension = pathinfo($file["name"], PATHINFO_EXTENSION);
$fileName = uniqid("shop_", true) . "." . strtolower($extension);

$targetPath = $uploadDir . $fileName;

if (!is_uploaded_file($file["tmp_name"])) {
    echo json_encode([
        "success" => false,
        "message" => "Invalid upload source"
    ]);
    exit;
}

if (!move_uploaded_file($file["tmp_name"], $targetPath)) {
    echo json_encode([
        "success" => false,
        "message" => "Failed to move uploaded file"
    ]);
    exit;
}

$photoPath = "uploads/shopPhotos/" . $fileName;

$stmt = $conn->prepare("
    INSERT INTO shop_photos (shop_id, shop_photo)
    VALUES (?, ?)
");

$stmt->bind_param("is", $shopId, $photoPath);

if ($stmt->execute()) {
    echo json_encode([
        "success" => true,
        "message" => "Photo uploaded successfully",
        "path" => $photoPath
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => $stmt->error
    ]);
}

$stmt->close();
$conn->close();;
