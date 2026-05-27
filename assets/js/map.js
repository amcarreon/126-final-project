if (typeof google === 'undefined' && window.parent && window.parent.google) {
    window.google = window.parent.google;
}

function initMap() {
    const defaultLoc = { lat: 10.641345268116764, lng: 122.2357864230011 }; // Miagao Plaza

    const map_canvas = document.getElementById('map');
    if (!map_canvas) return;

    const status = document.getElementById('location-status');
    const loc_display = document.getElementById('address-display');

    let lat = sessionStorage.getItem('shop_lat');
    let lng = sessionStorage.getItem('shop_lng');
    let shop_loc_name = sessionStorage.getItem('loc');
    let shop_loc = defaultLoc;

    if (status) status.innerText = "Detecting your location";

    if (lat && lng) {
        if (status) status.innerText = "Location found!";
        if (loc_display) loc_display.innerText = shop_loc_name;
        shop_loc = { lat: parseFloat(lat), lng: parseFloat(lng) };
    }
    else {
        console.warn("No coordinates available. Using default location.");
    }

    const map = new google.maps.Map(map_canvas, {
        zoom: 18,
        center: shop_loc,
        mapTypeControl: false
    });

    new google.maps.Marker({
        position: shop_loc,
        map: map,
        animation: google.maps.Animation.DROP
    });
}

window.initMap = initMap;

document.addEventListener("DOMContentLoaded", function() {
    if (typeof google !== 'undefined' && google.maps) {
        initMap();
    }
});