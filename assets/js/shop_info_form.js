document.addEventListener("DOMContentLoaded", loadShop);

async function loadShop() {
    try {
        const res = await fetch("../../api/editShop_api.php");
        const data = await res.json();

        console.log("SHOP API RESPONSE:", data);

        if (!data.success) {
            console.error(data.message);
            return;
        }

        const shop = data.data;

        const shopName = document.getElementById("shopName");
        const shopDesc = document.getElementById("shopDescription");
        const location = document.getElementById("location");
        const logo = document.getElementById("logoPreview");

        if (shopName) shopName.value = shop.shop_name || "";
        if (shopDesc) shopDesc.value = shop.shop_desc || "";
        if (location) location.value = shop.location || "";

        if (logo && shop.logo) {
            logo.src = "../../" + shop.logo;
        }
        let shopIdInput = document.getElementById("shop_id");

        if (!shopIdInput) {
            shopIdInput = document.createElement("input");
            shopIdInput.type = "hidden";
            shopIdInput.id = "shop_id";
            shopIdInput.name = "shop_id";
            document.querySelector("form").appendChild(shopIdInput);
        }

        shopIdInput.value = shop.shop_id;

        const contactInputs = document.querySelectorAll('input[name="contactInfo[]"]');

        if (data.contacts && contactInputs.length) {
            data.contacts.forEach((contact, index) => {
                if (contactInputs[index]) {
                    contactInputs[index].value = contact || "";
                }
            });
        }

        const socialLinks = document.querySelectorAll('input[name="socialMediaLink[]"]');
        const socialPlatforms = document.querySelectorAll('input[name="socialMediaPlatform[]"]');

        if (data.social_media && socialLinks.length) {
            data.social_media.forEach((item) => {
                const platform = item.platform;

                for (let i = 0; i < socialPlatforms.length; i++) {
                    if (socialPlatforms[i].value === platform) {
                        socialLinks[i].value = item.link || "";
                    }
                }
            });
        }       

    } catch (err) {
        console.error("Failed to load shop:", err);
    }
}