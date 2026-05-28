document.addEventListener("DOMContentLoaded", () => {

    const dropZone = document.getElementById("drop-zone");
    const container = document.getElementById("photosContainer");

    dropZone.addEventListener("click", () => {
        window.location.href = "shop_photos_form.html";
    });

    async function getShopInfo() {

        try {

            const response = await fetch("../../api/shopInfo_api.php", {
                method: "GET",
                credentials: "include"
            });

            const data = await response.json();

            if (data.success) {

                const shopId = data.data.shop_id;

                console.log("Shop ID:", shopId);

                loadPhotos(shopId);

            } else {
                console.log(data.message);
            }

        } catch (error) {
            console.error("Error:", error);
        }
    }

    async function loadPhotos(shopId) {

        try {

            const response = await fetch(`../../api/shopPhotos_api.php?shop_id=${shopId}`);

            const data = await response.json();

            if (data.status !== "success") {
                console.error(data.message);
                return;
            }

            container.innerHTML = "";

            data.data.forEach(photo => {

                const img = document.createElement("img");

                img.src = "../../" + photo.shop_photo;
                img.alt = "Shop Photo";

                container.appendChild(img);
            });

        } catch (error) {
            console.error("Failed to load photos:", error);
        }
    }

    getShopInfo();
});
