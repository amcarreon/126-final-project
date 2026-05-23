const BASE = "/126-final-project";

document.addEventListener("DOMContentLoaded", async () => {
    const shopId = new URLSearchParams(window.location.search).get("id");
    if (!shopId) return;

    try {
        const res = await fetch(
            `${BASE}/api/shop_by_id_api.php?shop_id=${shopId}`
        );
        const data = await res.json();

        if (!data.success || data.data.is_deleted) {
            document.body.innerHTML =
                "<h1>This shop is not available.</h1><p><a href=\"index.html\">Return to home</a></p>";
            return;
        }

        setupIframes(shopId);
    } catch (err) {
        console.error(err);
        document.body.innerHTML =
            "<h1>This shop is not available.</h1><p><a href=\"index.html\">Return to home</a></p>";
    }
});

function setupIframes(shopId) {
    const infoFrame = document.getElementById("shopInfoFrame");
    const contentFrame = document.getElementById("contentFrame");
    const servicesTab = document.getElementById("servicesTab");
    const photosTab = document.getElementById("photosTab");
    const locationTab = document.getElementById("locationTab");

    const servicesUrl = `services_page.html?id=${shopId}&mode=view`;
    const photosUrl = `photos_page.html?id=${shopId}&mode=view`;
    const locationUrl = `location_page.html?id=${shopId}`;
    const infoUrl = `shop_info.html?id=${shopId}`;

    if (infoFrame) infoFrame.src = infoUrl;
    if (contentFrame) contentFrame.src = servicesUrl;
    if (servicesTab) servicesTab.href = servicesUrl;
    if (photosTab) photosTab.href = photosUrl;
    if (locationTab) locationTab.href = locationUrl;
}
