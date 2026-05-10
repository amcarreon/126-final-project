// Get location from user
async function detect_loc () {
    const location = document.getElementById('location').value.trim();

    try {
        const res = await fetch(`geocode.php?address=${encodeURIComponent(location)}`);
        const result = await response.json();

        if (result.success === 'true') {
            const lat = result.latitude;
            const lng = result.longitude;  

            window.location.href = `map.html?lat=${lat}&lng=${lng}`;
            // initMap(lat, lng);
        }
        else {
            alert("Geocode failed: " + result.message);
        }
     
    }
    catch (error) {
        console.error("Error loading: ", error);
    }
}

// Display map
const defaultLoc = { lat: 10.640624654172045, lng: 122.22802900295375 }; // UPV

function initMap() {
    const parameters = new URLSearchParams(window.location.search);
    const lat = parseFloat(parameters.get('lat')) || defaultLoc.lat;
    const lng = parseFloat(parameters.get('lng')) || defaultLoc.lng;

    const map = new google.maps.Map(map, {
        zoom: 18, center: { lat, lng }
    });

    const marker = new google.maps.Marker({
        position: { lat, lng },
        map: map
    });
    // const shop_loc = { lat: lat_coords, lng:lng_coords };
    // const map = new google.maps.Map(document.getElementById('map'), {
    //     zoom: 18, center: shop_loc
    // });
    // const marker = new google.maps.Marker({
    //     position: shop_loc,
    //     map: map,
    // });
}
initMap();


// insert event listeners wala ko pa natapos