const BASE = '/126-final-project';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('shopProfileFormID');
    const photoUpload = document.getElementById('photoUpload');
    const cancelBtn = document.getElementById('cancelEdit');

    if (!form) return;

    let isEditMode = false;

    photoUpload?.addEventListener('change', handleImagePreview);
    cancelBtn?.addEventListener('click', () => {
        if (confirm('Discard changes?')) {
            window.location.href = isEditMode
                ? `${BASE}/views/seller/shop_info.html`
                : `${BASE}/views/seller/shop_profile_manager.html`;
        }
    });

    form.addEventListener('submit', (e) => {
        if (!validateForm(form)) {
            e.preventDefault();
        }
    });

    loadExistingShop(form).then((hasShop) => {
        isEditMode = hasShop;
        if (hasShop) {
            form.action = '../../includes/update_shop_info.php';
            if (photoUpload) photoUpload.required = false;
        }
    });

    async function loadExistingShop(shopForm) {
        try {
            const res = await fetch(`${BASE}/api/shopInfo_api.php`, {
                credentials: 'same-origin',
                cache: 'no-store',
            });

            if (res.status === 404) return false;
            if (!res.ok) return false;

            const payload = await res.json();
            if (!payload.success) return false;

            populateForm(payload.data);
            return true;
        } catch (err) {
            console.error('Failed to load shop:', err);
            return false;
        }
    }

    function populateForm(shop) {
        document.getElementById('shopName').value = shop.shop_name || '';
        document.getElementById('shopDescription').value = shop.shop_desc || '';
        document.getElementById('location').value = shop.location || '';

        const contactInputs = document.querySelectorAll('input[name="contactInfo[]"]');
        if (shop.contacts?.length) {
            shop.contacts.forEach((contact, index) => {
                const value = typeof contact === 'string'
                    ? contact
                    : contact.contact_info;
                if (contactInputs[index]) {
                    contactInputs[index].value = value || '';
                }
            });
        }

        if (shop.socialMedia?.length) {
            const platforms = document.querySelectorAll('input[name="socialMediaPlatform[]"]');
            const links = document.querySelectorAll('input[name="socialMediaLink[]"]');

            shop.socialMedia.forEach((item) => {
                for (let i = 0; i < platforms.length; i++) {
                    if (platforms[i].value === item.platform) {
                        links[i].value = item.link || '';
                    }
                }
            });
        }

        if (shop.logo) {
            showImagePreview(`${BASE}/${shop.logo}`);
        }
    }

    function isAllowedImage(file) {
        const allowedTypes = [
            'image/jpeg',
            'image/png',
            'image/gif',
            'image/webp',
            'image/pjpeg',
            'image/x-png',
        ];
        if (file.type && allowedTypes.includes(file.type)) {
            return true;
        }
        return /\.(jpe?g|png|gif|webp)$/i.test(file.name);
    }

    function handleImagePreview(e) {
        const file = e.target.files[0];
        if (!file) return;

        if (!isAllowedImage(file)) {
            notify('Invalid image type. Use JPEG, PNG, GIF, or WebP.', 'error');
            e.target.value = '';
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            notify('Image must be under 5MB', 'error');
            e.target.value = '';
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => showImagePreview(event.target.result);
        reader.onerror = () => notify('Could not read the image file', 'error');
        reader.readAsDataURL(file);
    }

    function showImagePreview(src) {
        const previewContainer =
            document.querySelector('.photoUploadDiv') ||
            document.querySelector('.imgDiv');

        if (!previewContainer) return;

        previewContainer.classList.add('has-preview');
        previewContainer.querySelectorAll('img').forEach((el) => el.remove());

        const img = document.createElement('img');
        img.src = src;
        img.alt = 'Shop logo preview';
        img.className = 'previewImage';
        previewContainer.appendChild(img);
    }

    function validateForm(shopForm) {
        const shopName = document.getElementById('shopName').value.trim();
        const location = document.getElementById('location').value.trim();
        const contacts = Array.from(
            shopForm.querySelectorAll('input[name="contactInfo[]"]')
        );

        if (!shopName) {
            notify('Shop name is required', 'error');
            return false;
        }

        if (!location) {
            notify('Location is required', 'error');
            return false;
        }

        const hasContact = contacts.some((input) => input.value.trim());
        if (!hasContact) {
            notify('At least one contact number is required', 'error');
            return false;
        }

        if (!isEditMode && photoUpload && !photoUpload.files.length) {
            notify('Please upload a shop logo', 'error');
            return false;
        }

        return true;
    }

    function notify(message, type) {
        document.querySelector('.notification')?.remove();

        const div = document.createElement('div');
        div.className = `notification notification-${type}`;
        div.innerHTML = `<span>${message}</span>`;
        document.body.appendChild(div);
        setTimeout(() => div.remove(), 4000);
    }
});
