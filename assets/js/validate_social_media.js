function validateSocialLink(platform, url) {
    const patterns = {
        facebook: /^(https?:\/\/)?(www\.)?facebook\.com\/[a-zA-Z0-9.]+\/?$/,
        instagram: /^(https?:\/\/)?(www\.)?instagram\.com\/[a-zA-Z0-9_.]+\/?$/
    };

    if (!patterns[platform]) {
        console.error(`Platform "${platform}" is not supported.`);
        return false;
    }

    if (url.trim() === "") return true;

    return patterns[platform].test(url.trim());
}

const form = document.getElementById('shopProfileFormID');
const fbInput = document.querySelector('.inputFB');
const igInput = document.querySelector('.inputIG');

const errorDisplay = document.createElement('div');
errorDisplay.id = "socialMediaError";
errorDisplay.style.color = "red";
errorDisplay.style.marginBottom = "10px";
errorDisplay.style.fontWeight = "bold";

form.addEventListener('submit', function(event) {
    event.preventDefault(); 

    if (errorDisplay.parentNode) {
        errorDisplay.parentNode.removeChild(errorDisplay);
    }

    const isFacebookValid = validateSocialLink('facebook', fbInput.value);
    const isInstagramValid = validateSocialLink('instagram', igInput.value);

    if (!isFacebookValid || !isInstagramValid) {
        errorDisplay.textContent = "Please enter valid Facebook and Instagram profile URLs.";
        const socialMediaDiv = document.querySelector('.socialMediaDiv');
        socialMediaDiv.insertBefore(errorDisplay, socialMediaDiv.firstChild);
        fbInput.focus();
        return;
    }

    const formData = new FormData(form);

    fetch('save_shop_profile.php', {
        method: 'POST',
        body: formData 
    })
    .then(response => response.text()) 
    .then(data => {
        if (data.trim() === "success") {
            window.location.href = "shop_profile_manager.html"; //if nakalagay na ang html sa php, then irename lang ito.
        } else {
            alert("Server Error: " + data);
        }
    })
    .catch(error => {
        console.error('Connection Error:', error);
        alert("Could not connect to the server. Please check your network.");
    });
});