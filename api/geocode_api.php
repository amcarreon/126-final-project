<?php
require_once __DIR__ . '/../config/config.php';

header('Content-Type: application/json');

// location validation in case of manual typing of address
function getValidAddress($loc, $lat, $lng) {
    $url = "";

    if (!empty($loc)) {
        $encodedLoc = urlencode($loc);
        $url = "https://maps.googleapis.com/maps/api/geocode/json?address={$encodedLoc}&components=country:PH&key=" . GOOGLE_MAPS_API_KEY;
    } 
    else if (!empty($lat) && !empty($lng)) {
        $url = "https://maps.googleapis.com/maps/api/geocode/json?latlng={$lat},{$lng}&key=" . GOOGLE_MAPS_API_KEY;
    } 
    else {
        return ['success' => false, 'message' => 'Missing address string parameter or coordinate markers.'];
    }

    $res = @file_get_contents($url);
    if ($res === false) {
        return ['success' => false, 'message' => 'Unable to establish secure transmission connection with Google servers.'];
    }

    $data = json_decode($res, true);

    if (isset($data['status']) && $data['status'] === 'OK') {
        $result = $data['results'][0];

        return [
            'success' => true,
            'formatted_address' => $result['formatted_address'],
            'latitude' => $result['geometry']['location']['lat'],
            'longitude' => $result['geometry']['location']['lng']
        ];
    } 
    else {
        $status = $data['status'] ?? 'UNKNOWN';
        $error = ($status === 'ZERO_RESULTS') ? "Location position could not be accurately pinned." : "Google API Error Status: {$status}";
        return ['success' => false, 'message' => $error];
    }
}

?>