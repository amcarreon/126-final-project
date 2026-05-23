const shopId = new URLSearchParams(window.location.search).get("id");

function init() {
    if (!shopId) {
        window.location.href = `${BASE}/views/admin/admin_panel.html`;
        return;
    }

    setupIframes();
    bindActions();
    bindDeleteModal();
}

document.addEventListener("DOMContentLoaded", init);

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

function bindActions() {
    const markBtn = document.getElementById("markReviewedBtn");
    const deleteBtn = document.getElementById("deleteShopBtn");

    if (markBtn) {
        markBtn.addEventListener("click", markAsReviewed);
    }

    if (deleteBtn) {
        deleteBtn.addEventListener("click", openDeleteModal);
    }
}

async function markAsReviewed() {
    const formData = new FormData();
    formData.append("shop_id", shopId);

    try {
        const res = await fetch(`${BASE}/includes/admin_mark_reviewed.php`, {
            method: "POST",
            body: formData
        });
        const data = await res.json();

        if (data.success) {
            alert("Shop marked as reviewed.");
            window.location.href = `${BASE}/views/admin/admin_panel.html`;
        } else {
            alert(data.message || "Could not mark shop as reviewed.");
        }
    } catch (err) {
        console.error(err);
        alert("An error occurred. Please try again.");
    }
}

function bindDeleteModal() {
    const modal = document.getElementById("deleteModal");
    const form = document.getElementById("deleteShopForm");
    const reasonInput = document.getElementById("deletionReasonInput");
    const proceedBtn = document.getElementById("proceedDeletionBtn");
    const cancelBtn = document.getElementById("cancelDeletionBtn");
    const backdrop = modal?.querySelector("[data-dismiss='modal']");

    if (!modal || !form || !reasonInput || !proceedBtn) return;

    reasonInput.addEventListener("input", () => {
        const hasContent = reasonInput.value.trim().length > 0;
        proceedBtn.disabled = !hasContent;
    });

    cancelBtn?.addEventListener("click", closeDeleteModal);
    backdrop?.addEventListener("click", closeDeleteModal);

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && !modal.hidden) {
            closeDeleteModal();
        }
    });

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const reason = reasonInput.value.trim();
        if (!reason) return;

        const formData = new FormData();
        formData.append("shop_id", shopId);
        formData.append("deletion_reason", reason);

        try {
            const res = await fetch(`${BASE}/includes/admin_delete_shop.php`, {
                method: "POST",
                body: formData
            });
            const data = await res.json();

            if (data.success) {
                closeDeleteModal();
                window.location.href = `${BASE}/views/admin/admin_panel.html`;
            } else {
                alert(data.message || "Delete failed.");
            }
        } catch (err) {
            console.error(err);
            alert("An error occurred. Please try again.");
        }
    });
}

function openDeleteModal() {
    const modal = document.getElementById("deleteModal");
    const reasonInput = document.getElementById("deletionReasonInput");
    const proceedBtn = document.getElementById("proceedDeletionBtn");

    if (!modal) return;

    modal.hidden = false;
    reasonInput.value = "";
    proceedBtn.disabled = true;
    reasonInput.focus();
}

function closeDeleteModal() {
    const modal = document.getElementById("deleteModal");
    if (modal) modal.hidden = true;
}
