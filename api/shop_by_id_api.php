<?php
require_once '../config/database.php';
require_once '../includes/admin_auth.php';

header("Content-Type: application/json");

admin_session_start();

$shopId = isset($_GET['shop_id']) ? (int) $_GET['shop_id'] : 0;
$isAdmin = is_admin_logged_in();

if ($shopId <= 0) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Invalid shop_id"]);
    exit;
}

$sql = "SELECT shop_id, shop_name, shop_desc, location, logo,
               is_deleted, is_reviewed, deletion_reason, owner_id
        FROM shops WHERE shop_id = ?";

if (!$isAdmin) {
    $sql .= " AND is_deleted = 0";
}

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $shopId);
$stmt->execute();
$shop = $stmt->get_result()->fetch_assoc();

if (!$shop) {
    http_response_code(404);
    echo json_encode(["success" => false, "message" => "Shop not found"]);
    exit;
}

$contacts = [];
$stmt2 = $conn->prepare("SELECT contact_info FROM contact_info WHERE shop_id = ?");
$stmt2->bind_param("i", $shopId);
$stmt2->execute();
$res2 = $stmt2->get_result();
while ($row = $res2->fetch_assoc()) {
    $contacts[] = $row;
}

$social = [];
$stmt3 = $conn->prepare("SELECT platform, link FROM social_media WHERE shop_id = ?");
$stmt3->bind_param("i", $shopId);
$stmt3->execute();
$res3 = $stmt3->get_result();
while ($row = $res3->fetch_assoc()) {
    $social[] = $row;
}

echo json_encode([
    "success" => true,
    "data" => [
        "shop_id" => (int) $shop['shop_id'],
        "owner_id" => (int) $shop['owner_id'],
        "shop_name" => $shop['shop_name'],
        "shop_desc" => $shop['shop_desc'],
        "location" => $shop['location'],
        "logo" => $shop['logo'],
        "is_deleted" => (int) $shop['is_deleted'] === 1,
        "is_reviewed" => (int) $shop['is_reviewed'] === 1,
        "deletion_reason" => $shop['deletion_reason'],
        "contacts" => $contacts,
        "socialMedia" => $social
    ]
]);

$conn->close();
