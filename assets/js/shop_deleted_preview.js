const BASE = "/126-final-project";

const shopId = new URLSearchParams(window.location.search).get("id");

document.addEventListener("DOMContentLoaded", async () => {
    if (!shopId) return;

    try {
        const res = await fetch(
            `${BASE}/api/shop_by_id_api.php?shop_id=${shopId}`,
            { credentials: "same-origin" }
        );
        const data = await res.json();

        if (data.success) {
            const el = document.getElementById("previewShopName");
            if (el) {
                el.textContent = `"${data.data.shop_name}" has been removed.`;
            }
        }
    } catch (err) {
        console.error(err);
    }
});
