<?php
session_start();
if (!isset($_SESSION['user_id'])) {
    die("User not logged in.");
}

require_once '../config/database.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    if (!isset($_SESSION['user_id'])) {
        die("Unauthorized");
    }

    $ownerId = $_SESSION['user_id'];
    $stmt = $conn->prepare("SELECT shop_id FROM shops WHERE owner_id = ?");
    $stmt->bind_param("i", $ownerId);
    $stmt->execute();

    $shopId = $shop['shop_id'];
    $socialMedia = $_POST['contactInfo[]'];

    $stmt = $conn->prepare("INSERT INTO social_media(shop_id, soc_med)
        VALUES (?, ?)");

    $stmt->bind_param("is", $shopId, $socialMedia);

    if ($stmt->execute()) {
        echo "Shop added successfully!";
    } else {
        echo "Error: " . $stmt->error;
    }

    $stmt->close();
}

$conn->close();

?>