let allShops = [];
let currentFilter = "all";
let searchKeyword = "";
let pendingDeleteShopId = null;

document.addEventListener("DOMContentLoaded", async () => {
    const ok = await requireAdminSession(true);
    if (!ok) return;

    bindSearch();
    bindFilters();
    bindDeleteModal();
    bindReasonModal();
    loadShops();
});

function bindSearch() {
    const input = document.getElementById("searchInput");
    const form = document.getElementById("searchForm");
    if (!input || !form) return;

    let timeout;
    const apply = () => {
        searchKeyword = input.value.toLowerCase().trim();
        renderTable();
    };

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        apply();
    });

    input.addEventListener("input", () => {
        clearTimeout(timeout);
        timeout = setTimeout(apply, 150);
    });
}

function bindFilters() {
    document.querySelectorAll(".filterBtn").forEach((btn) => {
        btn.addEventListener("click", () => {
            currentFilter = btn.dataset.filter;
            renderTable();
        });
    });
}

function bindDeleteModal() {
    const modal = document.getElementById("deleteModal");
    const form = document.getElementById("deleteForm");
    const reasonInput = document.getElementById("deletionReason");
    const confirmBtn = document.getElementById("confirmDeleteBtn");
    const cancelBtn = document.getElementById("cancelDeleteBtn");

    if (!modal || !form || !reasonInput || !confirmBtn) return;

    reasonInput.addEventListener("input", () => {
        confirmBtn.disabled = reasonInput.value.trim().length === 0;
    });

    cancelBtn?.addEventListener("click", () => closeDeleteModal());

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const reason = reasonInput.value.trim();
        if (!reason || !pendingDeleteShopId) return;

        const formData = new FormData();
        formData.append("shop_id", pendingDeleteShopId);
        formData.append("deletion_reason", reason);

        try {
            const res = await fetch(`${BASE}/includes/admin_delete_shop.php`, {
                method: "POST",
                body: formData,
                credentials: "same-origin"
            });
            const data = await res.json();

            if (data.success) {
                closeDeleteModal();
                loadShops();
            } else {
                alert(data.message || "Delete failed.");
            }
        } catch (err) {
            console.error(err);
            alert("An error occurred.");
        }
    });
}

function bindReasonModal() {
    document.getElementById("closeReasonBtn")?.addEventListener("click", () => {
        const modal = document.getElementById("reasonModal");
        if (modal) modal.hidden = true;
    });
}

async function loadShops() {
    try {
        const res = await fetch(`${BASE}/api/admin_shops_api.php`, {
            credentials: "same-origin"
        });
        const data = await res.json();

        if (res.status === 401) {
            window.location.href = `${BASE}/views/auth/admin_login_form.html`;
            return;
        }

        if (!data.success) {
            console.error('Failed to load shops:', data.message);
            const emptyMsg = document.getElementById('emptyMessage');
            if (emptyMsg) {
                emptyMsg.hidden = false;
                emptyMsg.textContent = data.message || 'Failed to load shops.';
            }
            return;
        }

        allShops = data.data;
        document.getElementById("statTotal").textContent = data.stats.total;
        document.getElementById("statUnreviewed").textContent = data.stats.unreviewed;
        document.getElementById("statDeleted").textContent = data.stats.deleted;
        renderTable();
    } catch (err) {
        console.error(err);
    }
}

function getVisibleShops() {
    return allShops.filter((shop) => {
        const matchesSearch =
            searchKeyword === "" ||
            shop.shop_name.toLowerCase().includes(searchKeyword);

        if (!matchesSearch) return false;

        if (currentFilter === "deleted") {
            return shop.is_deleted;
        }

        if (shop.is_deleted) return false;

        if (currentFilter === "unreviewed") {
            return !shop.is_reviewed;
        }

        return true;
    });
}

function getStatusLabel(shop) {
    if (shop.is_deleted) return "Deleted";
    if (shop.is_reviewed) return "Reviewed";
    return "Unreviewed";
}

function renderTable() {
    const tbody = document.getElementById("shopsTableBody");
    const emptyMsg = document.getElementById("emptyMessage");
    const shops = getVisibleShops();

    tbody.innerHTML = "";

    if (emptyMsg) emptyMsg.hidden = shops.length > 0;

    shops.forEach((shop) => {
        const row = document.createElement("tr");
        row.dataset.shopId = shop.shop_id;

        const nameCell = document.createElement("td");
        const nameLink = document.createElement("a");
        nameLink.href = shop.is_deleted
            ? `deleted_shop.html?id=${shop.shop_id}`
            : `shop_detail.html?id=${shop.shop_id}`;
        nameLink.textContent = shop.shop_name;
        nameCell.appendChild(nameLink);

        const statusCell = document.createElement("td");
        statusCell.textContent = getStatusLabel(shop);

        const actionsCell = document.createElement("td");
        actionsCell.appendChild(buildActions(shop));

        row.appendChild(nameCell);
        row.appendChild(statusCell);
        row.appendChild(actionsCell);

        row.addEventListener("click", (e) => {
            if (e.target.closest("button") || e.target.closest("a")) return;
            const dest = shop.is_deleted
                ? `deleted_shop.html?id=${shop.shop_id}`
                : `shop_detail.html?id=${shop.shop_id}`;
            window.location.href = dest;
        });

        tbody.appendChild(row);
    });
}

function buildActions(shop) {
    const wrap = document.createElement("span");

    if (!shop.is_deleted) {
        if (!shop.is_reviewed) {
            const reviewBtn = document.createElement("button");
            reviewBtn.type = "button";
            reviewBtn.textContent = "Mark as Reviewed";
            reviewBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                markReviewed(shop.shop_id);
            });
            wrap.appendChild(reviewBtn);
            wrap.appendChild(document.createTextNode(" "));
        }

        const deleteBtn = document.createElement("button");
        deleteBtn.type = "button";
        deleteBtn.textContent = "Delete Shop";
        deleteBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            openDeleteModal(shop.shop_id);
        });
        wrap.appendChild(deleteBtn);
    } else {
        const reasonBtn = document.createElement("button");
        reasonBtn.type = "button";
        reasonBtn.textContent = "View Reason";
        reasonBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            showReason(shop.deletion_reason);
        });
        wrap.appendChild(reasonBtn);
        wrap.appendChild(document.createTextNode(" "));

        const restoreBtn = document.createElement("button");
        restoreBtn.type = "button";
        restoreBtn.textContent = "Restore";
        restoreBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            restoreShop(shop.shop_id);
        });
        wrap.appendChild(restoreBtn);
    }

    return wrap;
}

async function markReviewed(shopId) {
    const formData = new FormData();
    formData.append("shop_id", shopId);

    try {
        const res = await fetch(`${BASE}/includes/admin_mark_reviewed.php`, {
            method: "POST",
            body: formData,
            credentials: "same-origin"
        });
        const data = await res.json();
        if (data.success) {
            loadShops();
        } else {
            alert(data.message || "Could not update shop.");
        }
    } catch (err) {
        console.error(err);
    }
}

async function restoreShop(shopId) {
    if (!confirm("Restore this shop?")) return;

    const formData = new FormData();
    formData.append("shop_id", shopId);

    try {
        const res = await fetch(`${BASE}/includes/admin_restore_shop.php`, {
            method: "POST",
            body: formData,
            credentials: "same-origin"
        });
        const data = await res.json();
        if (data.success) {
            loadShops();
        } else {
            alert(data.message || "Restore failed.");
        }
    } catch (err) {
        console.error(err);
    }
}

function openDeleteModal(shopId) {
    pendingDeleteShopId = shopId;
    const modal = document.getElementById("deleteModal");
    const reasonInput = document.getElementById("deletionReason");
    const confirmBtn = document.getElementById("confirmDeleteBtn");
    const hiddenId = document.getElementById("deleteShopId");

    if (hiddenId) hiddenId.value = shopId;
    if (reasonInput) reasonInput.value = "";
    if (confirmBtn) confirmBtn.disabled = true;
    if (modal) modal.hidden = false;
}

function closeDeleteModal() {
    pendingDeleteShopId = null;
    const modal = document.getElementById("deleteModal");
    if (modal) modal.hidden = true;
}

function showReason(reason) {
    const modal = document.getElementById("reasonModal");
    const text = document.getElementById("reasonModalText");
    if (text) text.textContent = reason || "No reason provided.";
    if (modal) modal.hidden = false;
}
