document.addEventListener("DOMContentLoaded", initSearch);

function initSearch() {

    const form = document.getElementById("searchForm");
    const input = document.querySelector(".searchStoreButton");
    const results = document.getElementById("searchResults");

    if (!form || !input || !results) return;

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const query = input.value.trim();

        searchShops(query, results);
    });
}

async function fetchShops(query) {

    const res = await fetch(
        `/126-final-project/api/searchShop_api.php?searchInput=${encodeURIComponent(query)}`
    );

    return await res.json();
}

async function searchShops(query, resultsContainer) {

    const template = document.getElementById("shopCardTemplate");

    if (!query) {
        resultsContainer.innerHTML = "<p>Please enter a shop name.</p>";
        return;
    }

    try {
        const data = await fetchShops(query);

        if (!data || data.status !== "success") {
            resultsContainer.innerHTML = `<p>${data.message || "Error"}</p>`;
            return;
        }

        const shops = data.data;

        if (!shops.length) {
            resultsContainer.innerHTML = "<p>No shops found.</p>";
            return;
        }

        resultsContainer.innerHTML = "";

        shops.forEach(shop => {

            const clone = template.content.cloneNode(true);

            const nameEl = clone.querySelector(".shopName");
            const imgContainer = clone.querySelector(".shopImageContainer");

            if (nameEl) nameEl.textContent = shop.shop_name || "";

            if (imgContainer) {
                imgContainer.innerHTML = `
                    <img src="/126-final-project/${shop.logo}" width="80">
                `;
            }

            resultsContainer.appendChild(clone);
        });

    } catch (err) {
        console.error("Search error:", err);
        resultsContainer.innerHTML = "<p>Error searching shops.</p>";
    }
}