const BASE = "/126-final-project";

document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const shopId = params.get("id");

    if (!shopId) return;

    loadPhotos(shopId);
});

async function loadPhotos(shopId) {
    let container = document.getElementById("photosContainer");

    if (!container) {
        container = document.createElement("div");
        container.id = "photosContainer";
        container.className = "photosContainer";
        document.body.appendChild(container);
    }

    try {
        const res = await fetch(
            `${BASE}/api/shopPhotos_api.php?shop_id=${shopId}`,
            { credentials: "same-origin" }
        );
        const data = await res.json();

        if (data.status !== "success" || !data.data?.length) {
            container.textContent = "No photos uploaded.";
            return;
        }

        container.innerHTML = "";

        data.data.forEach((photo) => {
            const photoDiv = document.createElement("div");
            photoDiv.className = "photo-item";

            const img = document.createElement("img");
            img.src = `${BASE}/${photo.shop_photo}`;
            img.alt = "Shop photo";

            photoDiv.appendChild(img);
            container.appendChild(photoDiv);
        });
    } catch (err) {
        console.error(err);
        container.textContent = "Failed to load photos.";
    }
}
