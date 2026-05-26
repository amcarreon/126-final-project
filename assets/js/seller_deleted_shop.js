const BASE = "/126-final-project";

document.addEventListener("DOMContentLoaded", () => {
    fetch(`${BASE}/api/shopInfo_api.php`, { credentials: "same-origin" })
        .then((res) => res.json())
        .then((data) => {
            if (!data.success) {
                window.location.href = `${BASE}/views/seller/shop_info_form.html`;
                return;
            }

            const shop = data.data;

            if (!shop.is_deleted) {
                window.location.href =
                    `${BASE}/views/seller/shop_profile_manager.html`;
                return;
            }

            document.getElementById("sellerDeletionReason").textContent =
                shop.deletion_reason || "No reason provided.";
        })
        .catch((err) => console.error(err));
});
