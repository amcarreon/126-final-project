/**
 * Shop Profile Form Handler
 * Manages form submission, image preview, validation, and API communication
 */

class ShopProfileHandler {
    constructor() {
        this.form = document.getElementById('shopProfileFormID');
        this.photoUpload = document.getElementById('photoUpload');
        this.cancelBtn = document.getElementById('cancelEdit');
        this.submitBtn = this.form.querySelector('.submit');
        
        // Form inputs
        this.shopName = document.getElementById('shopName');
        this.shopDescription = document.getElementById('shopDescription');
        this.contactInfo = document.getElementById('contactInfo');
        this.socialMedia = document.getElementById('socialMediaProfiles');
        this.location = document.getElementById('location');

        this.socialMediaPlatform = document.getElementById('socialMediaPlatform');
        this.socialMediaLink = document.getElementById('socialMediaLink');
        
        this.shopId = this.getShopIdFromURL();
        this.originalImage = null;
        
        this.init();
    }

    /**
     * Initialize event listeners and load existing shop data
     */
    init() {
        this.attachEventListeners();
        this.loadShopData();
    }

    /**
     * Attach event listeners to form elements
     */
    attachEventListeners() {
        // Image upload
        this.photoUpload.addEventListener('change', (e) => this.handleImageUpload(e));
        
        // Form submission
        this.form.addEventListener('submit', (e) => this.handleFormSubmit(e));

        // Social media platform change
        this.socialMediaPlatform.addEventListener('change', () => this.handlePlatformChange());
        
        // Cancel button
        if (this.cancelBtn) {
            this.cancelBtn.addEventListener('click', () => this.handleCancel());
        }

        // Description toggle button
        const toggleBtn = document.getElementById('toggleDescription');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => this.toggleDescription());
        }
    }

    /**
     * Extract shop ID from URL query parameters
     */
    getShopIdFromURL() {
        const params = new URLSearchParams(window.location.search);
        return params.get('id') || null;
    }

    /**
     * Load existing shop data from API
     */
    async loadShopData() {
        if (!this.shopId) {
            console.warn('No shop ID provided');
            return;
        }

        try {
            const response = await fetch(`../../api/shopInfo_api.php?id=${this.shopId}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            if (result.success && result.data) {
                this.populateForm(result.data);
                this.originalImage = result.data.logo;
            } else {
                this.showError(result.message || 'Failed to load shop data');
            }
        } catch (error) {
            console.error('Error loading shop data:', error);
            this.showError('Failed to load shop data. Please refresh the page.');
        }
    }

    /**
     * Populate form fields with existing shop data
     */
    populateForm(shopData) {
        this.shopName.value = shopData.shop_name || '';
        const fullDesc = shopData.shop_desc || '';
        this.shopDescription.value = this.truncateDescription(fullDesc, 30);
        this.shopDescription.dataset.fullText = fullDesc;
        this.shopDescription.dataset.expanded = 'false';
        this.contactInfo.value = shopData.contact_info || '';
        this.location.value = shopData.location || '';
        
        const socialData = shopData.social_media ? JSON.parse(shopData.social_media) : {};
        this.socialMediaPlatform.value = socialData.platform || '';
        this.socialMediaLink.value = socialData.link || '';

        // Display existing logo if available
        if (shopData.logo) {
            this.displayImagePreview(shopData.logo);
        }
    }

    /**
     * Truncate text to a word limit
     */
    truncateDescription(text, wordLimit = 30) {
        const words = text.split(' ');
        if (words.length > wordLimit) {
            return words.slice(0, wordLimit).join(' ') + '...';
        }
        return text;
    }

    /**
     * Toggle description between truncated and full text
     */
    toggleDescription() {
        const isExpanded = this.shopDescription.dataset.expanded === 'true';
        const toggleBtn = document.getElementById('toggleDescription');
        
        if (isExpanded) {
            this.shopDescription.value = this.truncateDescription(this.shopDescription.dataset.fullText, 30);
            toggleBtn.textContent = 'More...';
        } else {
            this.shopDescription.value = this.shopDescription.dataset.fullText;
            toggleBtn.textContent = 'Less';
        }
        
        this.shopDescription.dataset.expanded = !isExpanded;
    }

    /**
     * Handle image file upload
     */
    handleImageUpload(event) {
        const file = event.target.files[0];

        if (!file) return;

        // Validate file type
        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            this.showError('Please upload a valid image file (JPEG, PNG, GIF, or WebP)');
            this.photoUpload.value = '';
            return;
        }

        // Validate file size (e.g., max 5MB)
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            this.showError('Image size must be less than 5MB');
            this.photoUpload.value = '';
            return;
        }

        // Read and display preview
        const reader = new FileReader();
        reader.onload = (e) => {
            this.displayImagePreview(e.target.result);
        };
        reader.readAsDataURL(file);
    }

    /**
     * Display image preview
     */
    displayImagePreview(imageSrc) {
        const imgDiv = document.querySelector('.imgDiv');
        
        // Remove existing preview if present
        const existingImg = imgDiv.querySelector('img');
        if (existingImg) {
            existingImg.remove();
        }

        const img = document.createElement('img');
        img.src = imageSrc;
        img.alt = 'Shop logo preview';
        img.style.maxWidth = '200px';
        img.style.maxHeight = '200px';
        img.style.borderRadius = '8px';
        img.style.marginTop = '10px';
        img.style.objectFit = 'cover';

        imgDiv.appendChild(img);
    }

    /**
     * Validate form inputs
     */
    validateForm() {
        const errors = [];

        if (!this.shopName.value.trim()) {
            errors.push('Shop name is required');
        }

        if (!this.contactInfo.value.trim()) {
            errors.push('Contact information is required');
        }

        if (!this.location.value.trim()) {
            errors.push('Location is required');
        }

        const phoneRegex = /^[0-9+\-\s()]{10,}$/;
        if (this.contactInfo.value && !phoneRegex.test(this.contactInfo.value)) {
            errors.push('Please enter a valid contact number');
        }

        // Validate social media
        if (!this.validateSocialMedia()) {
            errors.push('Please enter a valid social media link');
        }

        if (errors.length > 0) {
            this.showError(errors.join('\n'));
            return false;
        }

        return true;
    }
    

    /**
     * Validate location in geocode API
     */

    async validateLocation() {
        const loc = this.location.value.trim();
        const status = document.getElementById('location-status');
        if (status) status.innerText = "Detecting location...";

        try {
            const res = await fetch(`geocode_api.php?address=${encodeURIComponent(loc)}`);
            const result = await res.json();
            
            if (result.success === true) {
                const lat = result.latitude;
                const lng = result.longitude;
        
                window.location.href = `location_page.html?lat=${lat}&lng=${lng}`;
            }
            else {
                if (status) status.innerText = "";
                alert("Geocode failed: " + result.message);
            }    
            
        }
        catch(error) {
            console.error("Error loading page: ", error);
        }
    }


    /**
     * Validate social media platform and link
     */
    validateSocialMedia() {
        const platforms = [
            document.getElementById('socialMediaPlatform').value,
            document.querySelector('[name="socialMediaPlatform2"]')?.value || ''
        ];
        const links = [
            document.getElementById('socialMediaLink').value.trim(),
            document.querySelector('[name="socialMediaLink2"]')?.value.trim() || ''
        ];

        const validators = {
            facebook: /^(https?:\/\/)?(www\.)?facebook\.com\/[a-zA-Z0-9._-]+\/?$/,
            instagram: /^(https?:\/\/)?(www\.)?instagram\.com\/[a-zA-Z0-9._-]+\/?$/
        };

        for (let i = 0; i < platforms.length; i++) {
            const platform = platforms[i];
            const link = links[i];

            if (!platform && !link) continue; // Both empty is ok
            if (platform && !link) return false; // Platform selected but no link
            if (!platform && link) return false; // Link provided but no platform selected
            
            if (!validators[platform].test(link)) return false;
        }

        return true;
    }

    /**
     * Handle adding new social media input when platform is selected
     */
    handlePlatformChange() {
        const platform = this.socialMediaPlatform.value;
        
        if (platform) {
            // Check if another row already exists
            const existingRow = document.getElementById('socialMediaRow2');
            if (!existingRow) {
                // Create new row
                const newRow = document.createElement('div');
                newRow.id = 'socialMediaRow2';
                newRow.className = 'socialMediaDiv';
                newRow.innerHTML = `
                    <select name="socialMediaPlatform2">
                        <option value="">Select Platform</option>
                        <option value="facebook">Facebook</option>
                        <option value="instagram">Instagram</option>
                    </select>
                    <input type="text" name="socialMediaLink2" placeholder="Social Media Link">
                    <button type="button" class="removeRow" onclick="this.parentElement.remove()">Remove</button>
                `;
                
                // Insert after the first social media row
                const firstRow = document.querySelector('.socialMediaDiv');
                firstRow.parentNode.insertBefore(newRow, firstRow.nextSibling);
            }
        }
    }

    /**
     * Handle form submission
     */
    async handleFormSubmit(event) {
        event.preventDefault();

        // Validate form
        if (!this.validateForm()) {
            return;
        }

        // Disable submit button to prevent duplicate submissions
        this.submitBtn.disabled = true;
        this.submitBtn.textContent = 'Saving...';

        try {
            const formData = new FormData(this.form);
            const socialMedia = {
                platform: this.socialMediaPlatform.value,
                link: this.socialMediaLink.value,
                platform2: document.querySelector('[name="socialMediaPlatform2"]')?.value || '',
                link2: document.querySelector('[name="socialMediaLink2"]')?.value || ''
            };
            formData.set('socialMediaProfiles', JSON.stringify(socialMedia));

            const response = await fetch(this.form.action, {
                method: this.form.method,
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                this.showSuccess('Shop profile updated successfully!');
                // Optionally redirect or reset form after short delay
                setTimeout(() => {
                    // Uncomment to redirect: window.location.href = '/seller/dashboard';
                }, 1500);
            } else {
                this.showError(result.message || 'Failed to save changes');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            this.showError('An error occurred while saving. Please try again.');
        } finally {
            // Re-enable submit button
            this.submitBtn.disabled = false;
            this.submitBtn.textContent = 'Save Changes';
        }
    }

    /**
     * Handle cancel button click
     */
    handleCancel() {
        if (confirm('Are you sure you want to discard changes?')) {
            this.form.reset();
            if (this.originalImage) {
                this.displayImagePreview(this.originalImage);
            } else {
                const existingImg = document.querySelector('.imgDiv img');
                if (existingImg) {
                    existingImg.remove();
                }
            }
        }
    }

    /**
     * Show error notification
     */
    showError(message) {
        this.showNotification(message, 'error');
    }

    /**
     * Show success notification
     */
    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    /**
     * Display notification message
     */
    showNotification(message, type) {
        // Remove existing notification if present
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span>${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;

        // Add basic styling if not present in CSS
        if (!document.querySelector('style[data-notifications]')) {
            const style = document.createElement('style');
            style.setAttribute('data-notifications', '');
            style.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    padding: 16px;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                    z-index: 9999;
                    animation: slideIn 0.3s ease-out;
                }

                @keyframes slideIn {
                    from {
                        transform: translateX(400px);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }

                .notification-error {
                    background-color: #fee;
                    color: #c33;
                    border-left: 4px solid #c33;
                }

                .notification-success {
                    background-color: #efe;
                    color: #3c3;
                    border-left: 4px solid #3c3;
                }

                .notification-content {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 12px;
                }

                .notification-close {
                    background: none;
                    border: none;
                    font-size: 24px;
                    cursor: pointer;
                    color: inherit;
                    padding: 0;
                    width: 24px;
                    height: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .notification-close:hover {
                    opacity: 0.7;
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(notification);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ShopProfileHandler();
});