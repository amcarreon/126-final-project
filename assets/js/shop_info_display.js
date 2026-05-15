document.addEventListener('DOMContentLoaded', function () {

    fetch('../../api/shopInfo_api.php')
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
        document.getElementById('storeImageID').src = shop.logo;
    }

    // Display contact info
    let contactHTML = '';
    if (shop.contacts && shop.contacts.length > 0) {
        contactHTML = shop.contacts.map(contact => contact.contact_info).join('<br>');
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
    const params = new URLSearchParams(window.location.search);
    const shopId = params.get('id');
    window.location.href = `/126-final-project/views/seller/shop_info_form.php?id=${shopId}`;
}
