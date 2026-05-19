<?php

session_start();
require_once '../config/database.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    if (!isset($_SESSION['user_id'])) {
        http_response_code(401);
        exit("Unauthorized");
    }

    $photoId = $_POST['photo_id'] ?? null;
    $ownerId = $_SESSION['user_id'];

    if (!$photoId) {
        exit("Photo ID required");
    }

    $delete = $conn->prepare("DELETE FROM shop_photos WHERE id = ?");
    $delete->bind_param("i", $photoId);

    if ($delete->execute()) {
        echo "Photo deleted successfully.";
    } else {
        echo "Delete failed: " . $delete->error;
    }

    $delete->close();
}

$conn->close();

?>