<?php
require_once '.../config/config.php';
header('Content-Type: application/json');


if ($_SERVER['REQUEST_METHOD'] === 'POST' && !empty($_POST['location'])) {
    $address = $_POST['location'] ?? '';

    $encoded_address = urlencode($address);

    $url = "https://maps.googleapis.com/maps/api/geocode/json?address={$encoded_address}&key=" . GOOGLE_MAPS_API_KEY;

    $res = file_get_contents($url);

    $data = json_decode($res, true);

    if ($data['status'] !== 'OK') {
        echo json_encode ([
            'success' => false,
            'message' => 'Invalid Location'
        ]);
        exit;
    }

    $res = $data['results'][0];

    echo json_encode ([
        'success' => true,

        'formatted_address' => $res['formatted_address'],
        'latitude' => $res['geometry']['location']['lat'],
        'longitude' => $res['geometry']['location']['lng']
    ]);
        
    
}

?>