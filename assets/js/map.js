// Display map
const defaultLoc = { lat: 10.641345268116764, lng: 122.2357864230011 }; // Miagao Plaza
function initMap() {
    const parameters = new URLSearchParams(window.location.search);
    const lat_coords = parseFloat(parameters.get('lat')) || defaultLoc.lat;
    const lng_coords = parseFloat(parameters.get('lng')) || defaultLoc.lng;
    const shop_loc = { lat: lat_coords, lng: lng_coords };
    const status = document.getElementById('location-status');

    if (status) status.innerText = "Detecting location...";

    const map_canvas = document.getElementById('map');

    if (!map_canvas) return;

    const map = new google.maps.Map(map_canvas, {
        zoom: 18, 
        center: shop_loc
    });

    const marker = new google.maps.Marker({
        position: shop_loc,
        map: map,
        draggable: true,
        label: "Drag me to your location!"
    });

    marker.addListener("dragend", () => {
        const newPos = marker.getPosition();
        const markerlat = newPos.lat();
        const markerlng = newPos.lng();

        if (markerlat == null || markerlng == null) return;

        await detect_loc(markerlat, markerlng);     
    });   
}

window.onload = initMap;

// Get location from marker
async function detect_loc(lat, lng) {
    try {
        const res = await fetch(`geocode_api.php?action=coordinates&lat=${lat}&lng=${lng}`);
        const result = await res.json();

        if (result.success === true) {
            document.getElementById('location-status').innerText = "Location found!";
            document.getElementById('address-display').innerText = result.formatted_address;
            
            const newURL = `location_page.html?lat=${lat}&lng=${lng}`;
            window.history.replaceState({}, '', newURL);
        }

        else {
            document.getElementById('location-status').innerText = "Invalid location.";
            alert("Validation failed: " + result.message);
        }

    }
    catch (error) {
        console.error("Request cannot be completed: ", error);
        document.getElementById('location-status').innerText = "Error during validation.";
    }
}