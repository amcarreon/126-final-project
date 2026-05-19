<?php

session_start();
require_once '../config/database.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    if (!isset($_SESSION['user_id'])) {
        http_response_code(401);
        exit("Unauthorized");
    }

    $ownerId = $_SESSION['user_id'];

    $stmt = $conn->prepare("UPDATE shops SET is_deleted = 1, deleted_at = NOW() WHERE owner_id = ?");

    $stmt->bind_param("i", $ownerId);

    if ($stmt->execute()) {
        echo "Shop deleted successfully (soft delete).";
    } else {
        echo "Delete failed: " . $stmt->error;
    }

    $stmt->close();
}

$conn->close();

?>