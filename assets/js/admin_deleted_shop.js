const shopId = new URLSearchParams(window.location.search).get("id");

document.addEventListener("DOMContentLoaded", () => {
    if (!shopId) {
        window.location.href = `${BASE}/views/admin/admin_panel.html`;
        return;
    }

    loadDeletedShop();
    bindActions();
});

async function loadDeletedShop() {
    try {
        const res = await fetch(
            `${BASE}/api/shop_by_id_api.php?shop_id=${shopId}&include_deleted=1`
        );
        const data = await res.json();

        if (!data.success) {
            alert(data.message || "Shop not found");
            window.location.href = `${BASE}/views/admin/admin_panel.html`;
            return;
        }

        const shop = data.data;

        if (!shop.is_deleted) {
            window.location.href =
                `${BASE}/views/admin/shop_detail.html?id=${shopId}`;
            return;
        }

        document.getElementById("deletedShopName").textContent = shop.shop_name;
        document.getElementById("deletionReasonText").textContent =
            shop.deletion_reason || "No reason provided.";
    } catch (err) {
        console.error(err);
    }
}

function bindActions() {
    const viewBtn = document.getElementById("viewStorePageBtn");
    const restoreBtn = document.getElementById("restoreShopBtn");

    viewBtn?.addEventListener("click", () => {
        window.open(
            `${BASE}/views/customer/shop_deleted_preview.html?id=${shopId}`,
            "_blank"
        );
    });

    restoreBtn?.addEventListener("click", restoreShop);
}

async function restoreShop() {
    if (!confirm("Restore this shop? It will be visible to customers again.")) {
        return;
    }

    const formData = new FormData();
    formData.append("shop_id", shopId);

    try {
        const res = await fetch(`${BASE}/includes/admin_restore_shop.php`, {
            method: "POST",
            body: formData
        });
        const data = await res.json();

        if (data.success) {
            alert("Shop restored successfully.");
            window.location.href = `${BASE}/views/admin/admin_panel.html`;
        } else {
            alert(data.message || "Restore failed.");
        }
    } catch (err) {
        console.error(err);
        alert("An error occurred. Please try again.");
    }
}
