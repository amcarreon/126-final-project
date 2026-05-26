const shopId = new URLSearchParams(window.location.search).get("id");

document.addEventListener("DOMContentLoaded", async () => {
    const ok = await requireAdminSession(true);
    if (!ok) return;

    if (!shopId) {
        window.location.href = `${BASE}/views/admin/admin_panel.html`;
        return;
    }
    setupIframes();
});

function setupIframes() {
    const infoFrame = document.getElementById("shopInfoFrame");
    const contentFrame = document.getElementById("contentFrame");
    const servicesTab = document.getElementById("servicesTab");
    const photosTab = document.getElementById("photosTab");
    const locationTab = document.getElementById("locationTab");

    const servicesUrl = `${BASE}/views/customer/services_page.html?id=${shopId}&mode=view`;
    const photosUrl = `${BASE}/views/customer/photos_page.html?id=${shopId}&mode=view`;
    const locationUrl = `${BASE}/views/customer/location_page.html?id=${shopId}`;
    const infoUrl = `${BASE}/views/customer/shop_info.html?id=${shopId}`;

    if (infoFrame) infoFrame.src = infoUrl;
    if (contentFrame) contentFrame.src = servicesUrl;
    if (servicesTab) servicesTab.href = servicesUrl;
    if (photosTab) photosTab.href = photosUrl;
    if (locationTab) locationTab.href = locationUrl;
}
