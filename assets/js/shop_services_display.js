const BASE = "/126-final-project";

document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const shopId = params.get("id");

    if (!shopId) return;

    loadServices(shopId);
});

async function loadServices(shopId) {
    const template = document.getElementById("serviceCardTemplate");
    let container = document.getElementById("servicesContainer");

    if (!container) {
        container = document.createElement("div");
        container.id = "servicesContainer";
        container.className = "servicesGrid";
        document.body.appendChild(container);
    }

    if (!template) {
        container.textContent = "No services to display.";
        return;
    }

    try {
        const res = await fetch(
            `${BASE}/api/shop_services_by_id_api.php?shop_id=${shopId}`,
            { credentials: "same-origin" }
        );
        const data = await res.json();

        if (!data.success || data.data.length === 0) {
            container.textContent = "No services listed.";
            return;
        }

        container.innerHTML = "";

        data.data.forEach((service) => {
            const clone = template.content.cloneNode(true);
            const title = clone.querySelector(".serviceTitleCard");
            const desc = clone.querySelector(".serviceDescriptionCard");
            const tbody = clone.querySelector(".serviceRowsContainer");
            const buttonsDiv = clone.querySelector(".buttonsDiv");

            if (buttonsDiv) buttonsDiv.remove();

            if (tbody) {
                tbody.innerHTML = `
                    <tr>
                        <td class="specification">${service.service_specification ?? ""}</td>
                        <td class="price">₱${service.service_price ?? ""}</td>
                    </tr>
                `;
            }

            if (title) title.textContent = service.title;
            if (desc) desc.textContent = service.service_description;

            container.appendChild(clone);
        });
    } catch (err) {
        console.error(err);
        container.textContent = "Failed to load services.";
    }
}
