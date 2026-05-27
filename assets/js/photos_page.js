document.addEventListener("DOMContentLoaded", () => {

    const dropZone = document.getElementById("drop-zone");
    const container = document.getElementById("photosContainer");

    dropZone.addEventListener("click", () => {
        window.location.href = "shop_photos_form.html";
    });

    const shopId = 2;

    async function loadPhotos() {

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

    loadPhotos();
});