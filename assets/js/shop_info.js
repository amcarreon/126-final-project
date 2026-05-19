function loadShopData() {

    fetch("../../api/shopInfo_api.php?id=1")
        .then(response => response.json())
        .then(data => {

            document.getElementById("shopName").value = data.data.shop_name || "";
            document.getElementById("shopDescription").value = data.data.shop_desc || "";
            document.getElementById("contactInfo").value = data.data.contact_info || "";
            document.getElementById("socialMediaProfiles").value = data.data.social_media || "";
            document.getElementById("addressRegion").value = data.data.location || "";

        })
        .catch(error => {
            console.error("Failed to load shop data:", error);
        });
}

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("editBtn").addEventListener("click", loadShopData);
});