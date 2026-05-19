<?php
require_once '../config/database.php';

header("Content-Type: application/json");

$sql = "SELECT shop_id, shop_name, shop_desc, location, logo FROM shops 
        WHERE is_deleted = 0";

$result = $conn->query($sql);

if (!$result) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Database error"
    ]);
    exit;
}

$shops = [];

while ($shop = $result->fetch_assoc()) {

    $shopId = $shop['shop_id'];

    $contacts = [];
    $stmt1 = $conn->prepare("SELECT contact_info FROM contact_info WHERE shop_id = ?");
    $stmt1->bind_param("i", $shopId);
    $stmt1->execute();
    $res1 = $stmt1->get_result();

    while ($row = $res1->fetch_assoc()) {
        $contacts[] = $row['contact_info'];
    }

    $social = [];
    $stmt2 = $conn->prepare("SELECT platform, link FROM social_media WHERE shop_id = ?");
    $stmt2->bind_param("i", $shopId);
    $stmt2->execute();
    $res2 = $stmt2->get_result();

    while ($row = $res2->fetch_assoc()) {
        $social[] = $row;
    }

    $shops[] = [
        "shop_id" => $shopId,
        "shop_name" => $shop['shop_name'],
        "shop_desc" => $shop['shop_desc'],
        "location" => $shop['location'],
        "logo" => $shop['logo'],
        "contacts" => $contacts,
        "socialMedia" => $social
    ];
}

echo json_encode([
    "success" => true,
    "data" => $shops
]);

$conn->close();
?>