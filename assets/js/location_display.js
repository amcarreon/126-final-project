const BASE = "/126-final-project";

document.addEventListener("DOMContentLoaded", () => {
    const shopId = new URLSearchParams(window.location.search).get("id");
    if (!shopId) return;

    fetch(`${BASE}/api/shop_by_id_api.php?shop_id=${shopId}`, { credentials: "same-origin" })
        .then((res) => res.json())
        .then((data) => {
            if (!data.success) return;
            const addressEl = document.getElementById("address-display");
            if (addressEl) {
                addressEl.textContent = data.data.location || "Location not specified.";
            }
        })
        .catch((err) => console.error(err));
});
