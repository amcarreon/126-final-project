<?php
require_once '../config/database.php';
require_once '../includes/admin_auth.php';

require_admin_json();

$sql = "SELECT shop_id, shop_name, is_deleted, is_reviewed, deletion_reason
        FROM shops
        ORDER BY shop_name ASC";

$result = $conn->query($sql);

if (!$result) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database error"]);
    exit;
}

$shops = [];
$stats = [
    "total" => 0,
    "unreviewed" => 0,
    "deleted" => 0
];

while ($shop = $result->fetch_assoc()) {
    // mysqli returns TINYINT as "0"/"1" strings; (bool)"0" is true in PHP
    $isDeleted = (int) $shop['is_deleted'] === 1;
    $isReviewed = (int) $shop['is_reviewed'] === 1;

    if ($isDeleted) {
        $stats["deleted"]++;
    } else {
        $stats["total"]++;
        if (!$isReviewed) {
            $stats["unreviewed"]++;
        }
    }

    $shops[] = [
        "shop_id" => (int) $shop['shop_id'],
        "shop_name" => $shop['shop_name'],
        "is_deleted" => $isDeleted,
        "is_reviewed" => $isReviewed,
        "deletion_reason" => $shop['deletion_reason']
    ];
}

echo json_encode([
    "success" => true,
    "data" => $shops,
    "stats" => $stats
]);

$conn->close();
