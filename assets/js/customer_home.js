function init() {
    template = document.getElementById("shopCardTemplate");
    container = document.querySelector(".shopDisplayDiv");


    if (!template || !container) {
        console.error("DOM not ready or wrong file");
        return;
    }

    loadShops();
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
} else {
    init();
}

function clearCards() {
    if (!container) return;
    container.innerHTML = "";
}


function makeShopCard(shop) {

    const clone = template.content.cloneNode(true);

    const card = clone.querySelector(".customerHomeDiv");
    const shopContainer = clone.querySelector(".shopContainers");
    const imageContainer = clone.querySelector(".shopImageContainer");
    const shopName = clone.querySelector(".shopName");

    // Store ID
    card.dataset.shopId = shop.shop_id;

    // Create image
    const img = document.createElement("img");

    if (shop.logo) {

        img.src = `/126-final-project/${shop.logo}`;

    } 
    
    else {

        img.src = "/126-final-project/Images/default-shop.png";

    }

    img.alt = shop.shop_name;
    img.classList.add("shopLogo");

    imageContainer.appendChild(img);

    // Shop name
    shopName.textContent = shop.shop_name;

    // Redirect on click
    shopContainer.addEventListener("click", () => {

        window.location.href =
            `/126-final-project/views/customer/shop_profile_page.html?id=${shop.shop_id}`;

    });

    container.appendChild(clone);
}

async function loadShops() {
    const res = await fetch("/126-final-project/api/shopCard_api.php");
    const data = await res.json();

    if (!data.success) return;

    allShops = data.data;

    renderShops(allShops);
}


function renderShops(shops) {
    clearCards();

    shops.forEach(shop => {
        makeShopCard(shop);
    });
}

window.addEventListener("message", (e) => {
    const keyword = String(e.data || "").toLowerCase().trim();


    const filtered = allShops.filter(shop => {
        return shop.shop_name.toLowerCase().includes(keyword);
    });

    renderShops(filtered);
});
