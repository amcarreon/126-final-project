document.addEventListener("DOMContentLoaded", loadServices);

async function loadServices() {

    const container = document.getElementById("servicesContainer");
    const template = document.getElementById("serviceCardTemplate");

    if (!container || !template) return;

    try {
        const res = await fetch("../../api/shopService_api.php");
        const data = await res.json();

        if (!data.success) {
            container.innerHTML = data.message;
            return;
        }

        container.innerHTML = "";

        data.data.forEach(service => {

            const clone = template.content.cloneNode(true);

            const title = clone.querySelector(".serviceTitleCard");
            const desc = clone.querySelector(".serviceDescriptionCard");

            const editBtn = clone.querySelector(".editBtn");
            const deleteBtn = clone.querySelector(".deleteBtn");
            const tbody = clone.querySelector(".serviceRowsContainer");

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

            if (editBtn) {
                editBtn.onclick = () => editService(service.id);
            }

            if (deleteBtn) {
                deleteBtn.onclick = () => deleteService(service.id);
            }

            container.appendChild(clone);
        });

    } catch (err) {
        console.error("Error loading services:", err);
    }
}

async function deleteService(serviceId) {

    if (!confirm("Are you sure you want to delete this service?")) {
        return;
    }

    try {
        const res = await fetch("../../api/delete_service.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: `service_id=${serviceId}`
        });

        const data = await res.json();
        console.log(data);

        if (data.success) {
            alert("Deleted successfully");

            // reload cards after delete
            loadServices();
        } else {
            alert(data.message || "Delete failed");
        }

    } catch (err) {
        console.error("Delete error:", err);
    }
}