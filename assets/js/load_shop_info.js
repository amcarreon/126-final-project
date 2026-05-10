document.addEventListener("DOMContentLoaded", () => {

    loadShopProfile(1);

});

async function loadShopProfile(shopId) {

    try {

        const response = await fetch(`../../api/shopInfo_api.php?id=${shopId}`);
        const result = await response.json();

        if (!result.success) {
            alert(result.message);
            return;
        }

        const shop = result.data;

        document.querySelector(".storeImage").src = shop.logo;
        document.getElementById("storeNameID").textContent = shop.shop_name;
        document.getElementById("contactInfoDetails").textContent = shop.contact_info;
        document.getElementById("locationDetails").textContent = shop.location;
        const socialList = document.getElementById("socialMediaProfilesList");

        socialList.innerHTML = "";

        const socials = shop.social_media.split(",");

        socials.forEach(profile => {

            const li = document.createElement("li");

            li.textContent = profile.trim();

            socialList.appendChild(li);

        });

    } catch (error) {

        console.error("Error loading shop profile:", error);

    }

}