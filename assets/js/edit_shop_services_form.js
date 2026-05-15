document.addEventListener("DOMContentLoaded", loadService);

function getServiceId() {
    const params = new URLSearchParams(window.location.search);
    const serviceId = params.get("id");

    if (!serviceId) {
        console.error("No service ID found in URL");
        return;
    }

    document.getElementById("service_id").value = serviceId;
    return serviceId;
}

async function loadService() {

    const serviceId = getServiceId();
    if (!serviceId) return;

    try {
        const res = await fetch(`../../api/editService_api.php?id=${serviceId}`);
        const data = await res.json();

        if (!data.success) {
            console.error(data.message);
            return;
        }

        const service = data.data;

        document.getElementById("serviceName").value = service.title || "";
        document.getElementById("serviceDescription").value = service.service_description || "";

        let templateId = "washId";

        if (service.title?.toLowerCase().includes("dry")) {
            templateId = "dryId";
        } else if (service.title?.toLowerCase().includes("deliver")) {
            templateId = "deliverId";
        }

        const template = document.getElementById(templateId);
        const clone = template.content.cloneNode(true);

        const container = document.querySelector(".servicesBox");

        const tbody = document.querySelector("tbody");

        if (tbody) {
            tbody.innerHTML = `
                <tr>
                    <td>
                        <input type="text" id="serviceSpecification" name="serviceSpecification"
                        value="${service.service_specification || ""}" required>
                    </td>
                    <td>
                        <input type="number" id="servicePrice" name="servicePrice"
                        value="${service.service_price || ""}" required>
                    </td>
                    <td>
                        <button type="button" class="btn-delete" onclick="removeRow(this)">Delete</button>
                    </td>
                </tr>
            `;
        }

    } catch (err) {
        console.error("Load error:", err);
    }
}