const BASE = "/126-final-project";

document.addEventListener("DOMContentLoaded", () => {
    fetch(`${BASE}/api/shopInfo_api.php`, { credentials: "same-origin" })
        .then((res) => res.json())
        .then((data) => {
            if (!data.success) return;

            if (data.data.is_deleted) {
                window.location.href = `${BASE}/views/seller/shop_deleted.html`;
            }
        })
        .catch((err) => console.error(err));
});
