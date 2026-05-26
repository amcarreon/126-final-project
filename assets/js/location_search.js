let finalLat = null;
let finalLng = null;

document.addEventListener("DOMContentLoaded", function() {
    // input field
    const location_input = document.getElementById('location');

    const autocomplete = new google.maps.places.Autocomplete(location_input, {
        types: ['geocode', 'establishment'],
        fields: ['geometry', 'formatted_address'],
        componentRestrictions: { country: 'ph'}
    });

    // event listener
    autocomplete.addListener('place_changed', function() {
        const place = autocomplete.getPlace();
        
        if (!place.geometry) {
            alert("No details available for this location.");
            return;
        }
        document.getElementById('location').value = place.formatted_address;
        document.getElementById('lat').value = place.geometry.location.lat();
        document.getElementById('lng').value = place.geometry.location.lng();

        $('#needs_geocoding').val('false');
    });

    $('#shopProfileID').on('submit', function(e) {
        e.preventDefault();

        const lat = $('#lat').val();
        const lng = $('#lng').val();

        // user manually typed in the location
        // uses geocode_api.php
        if (!lat || !lng) {
            $('#needs_geocoding').val('true');
        }

        $.ajax({
            url: '/126-final-project/includes/save_shop_profile.php',
            type: 'POST',
            data: $(this).serialize(), 
            dataType: 'json',
            success: function(response) {
                if (response.success) {
                    sessionStorage.setItem('loc', response.location);
                    sessionStorage.setItem('shop_lat', response.lat);
                    sessionStorage.setItem('shop_lng', response.lng);
                    alert("Address saved successfully! Redirecting to your profile...");

                    window.location.href = '/126-final-project/views/seller/shop_profile_manager.html';
                } else {
                    alert("Error: " + response.message);
                }
            },
            error: function() {
                alert("An error occurred on the server while saving.");
                alert("this is a test");
            }
        });
        
    });
});