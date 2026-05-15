// Display map
const defaultLoc = { lat: 10.6409604, lng: 122.2377498 }; // Miagao Plaza

function initMap() {
    const parameters = new URLSearchParams(window.location.search);
    const lat_coords = parseFloat(parameters.get('lat')) || defaultLoc.lat;
    const lng_coords = parseFloat(parameters.get('lng')) || defaultLoc.lng;
    const shop_loc = { lat: lat_coords, lng: lng_coords };

    const map_canvas = document.getElementById('map');

    if (map_canvas) {
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
            const lat = newPos.lat();
            const lng = newPos.lng();

            if (!lat & !lng) return;
            
            try {
                document.getElementById('address-display').innerText = "Location found.";
            
                fetch(`../../api/geocode_api.php?lat=${lat}&lng=${lng}`)
            }
            
            catch(error) {
                console.error("Error loading page: ", error);
            }

            window.location.href = `location_page.html?lat=${lat}&lng=${lng}`;
        });
    }
}

window.onload = initMap;