if (typeof google === 'undefined' && window.parent && window.parent.google) {
    window.google = window.parent.google;
}


window.initAutocomplete = function() {
    const location_input = document.getElementById('location');
    if (!location_input) return;

    
    if (!google || !google.maps || !google.maps.places) {
        console.error("Google Places library failed to map correctly.");
        return;
    }

   
    const autocomplete = new google.maps.places.Autocomplete(location_input, {
        types: ['geocode', 'establishment'],
        fields: ['geometry', 'formatted_address'],
        componentRestrictions: { country: 'ph'}
    });

    autocomplete.addListener('place_changed', function() {
        const place = autocomplete.getPlace();
        
        if (!place.geometry) {
            alert("No details available for this location.");
            document.getElementById('lat').value = null;
            document.getElementById('lng').value = null;
            return;
        }

        document.getElementById('location').value = place.formatted_address;
        document.getElementById('lat').value = place.geometry.location.lat();
        document.getElementById('lng').value = place.geometry.location.lng();
    });
};


document.addEventListener("DOMContentLoaded", function() {
    const location_input = document.getElementById('location');
    
    if (location_input) {
        location_input.addEventListener('input', function() {
            document.getElementById('lat').value = '';
            document.getElementById('lng').value = '';
        });
    }

    const form = document.getElementById('shopProfileID');
    if (form) {
        form.addEventListener('submit', function(e) {
            const location_val = document.getElementById('location').value;
            const lat_val = document.getElementById('lat').value;
            const lng_val = document.getElementById('lng').value;

            if (!lat_val || !lng_val) {
                e.preventDefault();
                alert("Please select a valid address from the dropdown suggestions list.");
                if (location_input) location_input.focus();
                return false;
            }

            sessionStorage.setItem('loc', location_val);
            sessionStorage.setItem('shop_lat', lat_val);
            sessionStorage.setItem('shop_lng', lng_val);
        });
    }
});