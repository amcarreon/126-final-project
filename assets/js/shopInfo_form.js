class ShopForm {
    constructor() {
        this.form = document.getElementById('shopProfileFormID');
        this.photoUpload = document.getElementById('photoUpload');
        this.cancelBtn = document.getElementById('cancelEdit');
        this.submitBtn = this.form.querySelector('.submit');

        this.shopId = new URLSearchParams(location.search).get('id') || null;
        this.imageBase64 = null;

        this.init();
    }

    init() {
        this.attachListeners();
        this.photoUpload.required = !this.shopId;

        if (this.shopId) {
            this.loadData();
        }
    }

    attachListeners() {
        this.photoUpload.addEventListener('change', (e) => this.handleImageUpload(e));
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        this.cancelBtn?.addEventListener('click', () => this.handleCancel());
    }

    async loadData() {
        try {
            const res = await fetch(`/126-final-project/api/shopInfo_api.php?id=${this.shopId}`);

            if (!res.ok) throw new Error('Failed to load shop data');

            const data = await res.json();

            if (data.success) {
                this.populateForm(data.data);
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            console.error(error);
            this.notify('Failed to load shop data. Please refresh.', 'error');
        }
    }

    populateForm(shop) {
        document.getElementById('shopName').value = shop.shop_name || '';
        document.getElementById('shopDescription').value = shop.shop_desc || '';
        document.getElementById('location').value = shop.location || '';

        const contactInputs = document.querySelectorAll('input[name="contactInfo"]');
        if (shop.contacts?.length) {
            shop.contacts.forEach((c, i) => {
                if (contactInputs[i]) {
                    contactInputs[i].value = c.contact_info;
                }
            });
        }

        if (shop.socialMedia?.length) {
            shop.socialMedia.forEach(s => {
                if (s.platform === 'facebook') {
                    document.querySelector('.inputFB').value = s.link || '';
                }
                if (s.platform === 'instagram') {
                    document.querySelector('.inputIG').value = s.link || '';
                }
            });
        }

        if (shop.logo) {
            this.showImagePreview(shop.logo);
        }
    }

    handleImageUpload(e) {
        const file = e.target.files[0];
        if (!file) return;

        if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type)) {
            this.notify('Invalid image type', 'error');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            this.notify('Image must be under 5MB', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = (r) => {
            this.imageBase64 = r.target.result;
            this.showImagePreview(this.imageBase64);
        };
        reader.readAsDataURL(file);
    }

    showImagePreview(src) {
        const imgDiv = document.querySelector('.imgDiv');
        const existing = imgDiv.querySelector('img');
        if (existing) existing.remove();

        const img = document.createElement('img');
        img.src = src;
        img.style.maxWidth = '200px';
        img.style.borderRadius = '8px';

        imgDiv.appendChild(img);
    }

    validate() {
        const shopName = document.getElementById('shopName').value.trim();
        const location = document.getElementById('location').value.trim();
        const contacts = document.querySelectorAll('input[name="contactInfo"]');

        if (!shopName) {
            this.notify('Shop name is required', 'error');
            return false;
        }

        if (!location) {
            this.notify('Location is required', 'error');
            return false;
        }

        const hasContact = Array.from(contacts).some(i => i.value.trim());
        if (!hasContact) {
            this.notify('At least one contact is required', 'error');
            return false;
        }

        return true;
    }

    async handleSubmit(e) {
        e.preventDefault();

        if (!this.validate()) return;

        this.submitBtn.disabled = true;
        this.submitBtn.textContent = 'Saving...';

        try {
            const contacts = Array.from(document.querySelectorAll('input[name="contactInfo"]'))
                .map(i => i.value.trim())
                .filter(Boolean);

            const social = [];
            const fb = document.querySelector('.inputFB').value.trim();
            const ig = document.querySelector('.inputIG').value.trim();

            if (fb) social.push({ platform: 'facebook', link: fb });
            if (ig) social.push({ platform: 'instagram', link: ig });

            const res = await fetch('/126-final-project/includes/save_shop_profile.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    shop_id: this.shopId,
                    shop_name: document.getElementById('shopName').value.trim(),
                    shop_desc: document.getElementById('shopDescription').value.trim(),
                    location,
                    contacts,
                    social_media: social,
                    logo: this.imageBase64
                })
            });

            const result = await res.json();

            if (result.success) {
                this.notify('Saved successfully', 'success');

                setTimeout(() => {
                    const id = this.shopId || result.data.shop_id;
                    location.href = `/126-final-project/shop_info.php?id=${id}`;
                }, 1000);
            } else {
                this.notify(result.message || 'Save failed', 'error');
            }

        } catch (err) {
            console.error(err);
            this.notify('Server error occurred', 'error');
        } finally {
            this.submitBtn.disabled = false;
            this.submitBtn.textContent = 'Save';
        }
    }

    handleCancel() {
        if (confirm('Discard changes?')) {
            this.form.reset();
            document.querySelector('.imgDiv img')?.remove();
            this.imageBase64 = null;
        }
    }

    notify(message, type) {
        const old = document.querySelector('.notification');
        old?.remove();

        const div = document.createElement('div');
        div.className = `notification notification-${type}`;
        div.innerHTML = `<span>${message}</span>`;

        document.body.appendChild(div);
        setTimeout(() => div.remove(), 4000);
    }
}

document.addEventListener('DOMContentLoaded', () => new ShopForm());
