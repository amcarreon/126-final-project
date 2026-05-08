<? php

if ($_SERVER['REQUEST METHOD'] === 'POST' && !empty($_POST['location'])) {
    $address = $_POST['location'] ?? ;

    $encodedAddress = urlencode($address);

    $url =
        "https://maps.googleapis.com/maps/api/geocode/json"
        . "?address={$encodedAddress}"
        . "&key=API_KEY";

    $res = file_get_contents($url);

    $data = json_decode($res, true);

    if ($data['status'] !== 'OK') {
        return [
            'success' => false,
            'message' => 'Invalid Location'
        ];
    }

    $res = $data['results'][0];

    return [
        'success' => true,

        'formatted_address' =>
            $res['formatted_address'],

        'latitude' =>
            $res['geometry']['location']['lat'],

        'longitude' =>
            $res['geometry']['location']['lng']
    ];
}

?>