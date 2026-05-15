<?php
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../config/database.php';

header('Content-Type: application/json');

$address = $_GET['address'] ?? '';
$lat = $_GET['lat'] ?? '';
$lng = $_GET['lng'] ?? '';

if(!empty($address)){
    $encoded_address = urlencode($address);
    $url = "https://maps.googleapis.com/maps/api/geocode/json?address={$encoded_address}&key=" . GOOGLE_MAPS_API_KEY;
}
else if (!empty($lat) && !empty($lng)) {
    $url = "https://maps.googleapis.com/maps/api/geocode/json?latlng={$lat},{$lng}&key=" . GOOGLE_MAPS_API_KEY;

}
else {
    echo json_encode([
        'success' => false, 
        'message' => 'Missing address or coordinates.'
    ]);
    exit;
}


$res = file_get_contents($url);
$data = json_decode($res, true);

if ($data['status'] === 'OK') {
    $res = $data['results'][0];

    echo json_encode ([
        'success' => true,
        'formatted_address' => $res['formatted_address'],
        'latitude' => $res['geometry']['location']['lat'],
        'longitude' => $res['geometry']['location']['lng']
    ]);
}
else {
    echo json_encode ([
        'success' => false,
        'message' => 'Invalid Location'
    ]);
    exit;
}