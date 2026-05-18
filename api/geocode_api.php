<?php
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../config/database.php';

header('Content-Type: application/json');

function getValidAddress($loc, $lat, $lng){
    $url = "";

    if (!empty($loc)){
        $encodedLoc = urlencode($loc);
        $url = "https://maps.googleapis.com/maps/api/geocode/json?address={$encodedLoc}&key=" . GOOGLE_MAPS_API_KEY;
    }

    else if (isset($lat, $lng) && is_numeric($lat) && is_numeric($lng)) {
        $url = "https://maps.googleapis.com/maps/api/geocode/json?latlng={$lat},{$lng}&key=" . GOOGLE_MAPS_API_KEY;
    }

    else {
        return [
            'success' => false,
            'message' => 'Error: Missing address string or coordinates.'
        ];
    }

    $res = file_get_contents($url);

    $data = json_decode($res, true);

    if ($res === false || !$data || !isset($data['status'])) {
        return [
            'success' => false,
            'message' => 'Error: Google Maps API failed or invalid response.'
        ];
    }

    if ($data['status'] === 'OK') {
        $res = $data['results'][0];

        return [
            'success' => true,
            'formatted_address' => $res['formatted_address'],
            'latitude' => $res['geometry']['location']['lat'],
            'longitude' => $res['geometry']['location']['lng']
        ];
    }

    else {
        $error = ($data['status'] === 'ZERO_RESULTS') ? "We couldn't locate..." : "Server error.";
        return [
            'success' => false,
            'message' => 'Error: '. $error ];
    }
}

$action = $_GET['action'] ?? '';

if ($action === 'geocode') {
    $loc = $_GET['address'] ?? '';
    $result = getValidAddress($loc, null, null);
    echo json_encode($result);
    exit;
}

if ($action === 'coordinates') {
    $lat = $_GET['lat'] ?? '';
    $lng = $_GET['lng'] ?? '';
    $result = getValidAddress(null, $lat, $lng);
    echo json_encode($result);
    exit;
}

if (isset($_GET['location']) && !count(debug_backtrace())) {
    $result = getValidAddress($_GET['location'], null, null);
    echo json_encode($result);
    exit;
}