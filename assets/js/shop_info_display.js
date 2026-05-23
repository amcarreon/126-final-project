document.addEventListener('DOMContentLoaded', function () {
    const params = new URLSearchParams(window.location.search);
    const shopId = params.get('id');

    const apiUrl = shopId
        ? `/126-final-project/api/shop_by_id_api.php?shop_id=${shopId}`
        : '/126-final-project/api/shopInfo_api.php';

    fetch(apiUrl, { credentials: 'same-origin' })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                displayShopInfo(data.data);
            } else {
                console.error(data.message);
            }
        })
        .catch(err => console.error(err));
});

function displayShopInfo(shop) {
    // Display basic info
    document.getElementById('storeNameID').textContent = shop.shop_name || '';
    document.getElementById('storeDescriptionDetails').textContent = shop.shop_desc || '';
    document.getElementById('locationDetails').textContent = shop.location || '';

    // Display logo/image
    if (shop.logo) {
        document.getElementById('storeImageID').src = "/126-final-project/" + shop.logo;
    }

    // Display contact info
    let contactHTML = '';
    if (shop.contacts && shop.contacts.length > 0) {
        contactHTML = shop.contacts.map(contact => {
            const value = typeof contact === 'string' ? contact : contact.contact_info;
            return value;
        }).join('<br>');
    }
    document.getElementById('contactInfoDetails').innerHTML = contactHTML || 'No contact info available';

    // Display social media
    let socialMediaHTML = '';
    if (shop.socialMedia && shop.socialMedia.length > 0) {
        socialMediaHTML = shop.socialMedia.map(social => 
            `<li><a href="${social.link}" target="_blank">${social.platform}</a></li>`
        ).join('');
    }
    document.getElementById('socialMediaProfilesList').innerHTML = socialMediaHTML || '<li>No social media profiles</li>';
}

function goToEditPage() {
    window.location.href = '/126-final-project/views/seller/shop_info_form.html';
}
