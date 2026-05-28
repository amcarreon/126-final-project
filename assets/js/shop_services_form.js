// ======= POPUP OPEN / CLOSE =======
async function executeSave() {
    const formData = new FormData(form);

    try {
        const response = await fetch("../../includes/save_service.php", {
            method: "POST",
            body: formData
        });

        const data = await response.json(); // now expects JSON

        if (data.success) {
            document.querySelector('#errorBox').innerHTML = '<p style="color:green;">Saved successfully!</p>';

            form.reset();

            const tableBody = document.querySelector("table tbody");
            while (tableBody.rows.length > 1) {
                tableBody.deleteRow(1);
            }

            // Reload service cards then close popup after short delay
            if (typeof loadServices === "function") loadServices();
            setTimeout(() => {
                closeServicePopup();
                document.querySelector('#errorBox').innerHTML = '';
            }, 800);

        } else {
            document.querySelector('#errorBox').innerHTML = `<p style="color:red;">${data.message}</p>`;
        }

    } catch (error) {
        console.error("Error:", error);
        document.querySelector('#errorBox').innerHTML = `<p style="color:red;">Network error. Check console.</p>`;
    }
}
function openServicePopup() {
    document.getElementById('servicesPopUp').classList.add('active');
}

function closeServicePopup() {
    document.getElementById('servicesPopUp').classList.remove('active');
}

// ======= ADD / REMOVE ROWS =======
let counter = 0;

const addRow = () => {
    counter++;
    const table = document.querySelector('table tbody');
    const newRow = table.insertRow();

    const serviceCell = newRow.insertCell(0);
    serviceCell.innerHTML = '<input type="text" class="serviceSpecification" name="serviceSpecification[]" placeholder="Specification (Ex. 5 kg)" required>';

    const priceCell = newRow.insertCell(1);
    priceCell.innerHTML = '<input type="number" class="servicePrice" name="servicePrice[]" placeholder="Price" min="0" required>';

    const actionCell = newRow.insertCell(2);
    actionCell.innerHTML = `<button class="btn-delete" onclick="removeRow(this)">Delete</button>`;
};

const removeRow = (btn) => {
    const row = btn.closest('tr');
    row.parentNode.removeChild(row);
};

// ======= VALIDATION =======
let errors = [];

const validateForm = () => {
    errors = [];
    let isValid = true;

    const setInvalid = (id) => {
        const el = document.getElementById(id);
        if (el) el.classList.add('error-border');
        isValid = false;
    };

    const setElementInvalid = (element) => {
        element.classList.add('error-border');
        isValid = false;
    };

    const serviceName = document.getElementById('serviceName').value.trim();
    if (!serviceName) {
        errors.push('Service name is required.');
        setInvalid('serviceName');
    }

    const serviceDescription = document.getElementById('serviceDescription').value.trim();
    if (serviceDescription.length > 0 && serviceDescription.length < 5) {
        errors.push('Service description must be at least 5 characters if provided.');
        setInvalid('serviceDescription');
    }

    const specs = document.getElementsByName('serviceSpecification[]');
    const prices = document.getElementsByName('servicePrice[]');

    Array.from(specs).forEach((spec, i) => {
        if (!spec.value.trim()) {
            setElementInvalid(spec);
        }
        if (!prices[i].value || prices[i].value < 0) {
            setElementInvalid(prices[i]);
        }
        if (!spec.value.trim() || !prices[i].value || prices[i].value < 0) {
            errors.push(`Line ${i + 1}: Specification and valid price are required.`);
            isValid = false;
        }
    });

    return isValid;
};

// ======= FORM SUBMIT =======
const form = document.querySelector('#serviceForm');

form.addEventListener('submit', function (event) {
    event.preventDefault();

    // Clear previous error borders
    document.querySelectorAll('.error-border').forEach(el => el.classList.remove('error-border'));

    if (validateForm()) {
        executeSave();
    } else {
        showErrors(errors);
    }
});

async function executeSave() {
    const formData = new FormData(form);

    try {
        const response = await fetch("../../includes/save_service.php", {
            method: "POST",
            body: formData
        });

        const data = await response.text();

        if (data.toLowerCase().includes("successfully")) {
            form.reset();

            const tableBody = document.querySelector("table tbody");
            while (tableBody.rows.length > 1) {
                tableBody.deleteRow(1);
            }

            document.querySelector('#errorBox').innerHTML = '';
            closeServicePopup();
        } else {
            errors.push("Failed: " + data);
            showErrors(errors);
        }
    } catch (error) {
        console.error("Error:", error);
        errors.push("An error occurred while saving. Check console for details.");
        showErrors(errors);
    }
}

function showErrors(errors) {
    const errorBox = document.querySelector('#errorBox');
    errorBox.innerHTML = errors.map(e => `<p style="color:red;">${e}</p>`).join('');
}

// ======= CANCEL BUTTON WITH MODAL =======
const cancelBtn = document.querySelector('.cancel-btn');
const modal = document.getElementById("customModal");
const confirmYes = document.getElementById("confirmYes");
const confirmNo = document.getElementById("confirmNo");

cancelBtn.addEventListener('click', () => {
    modal.classList.add("modal-active");
});

confirmYes.addEventListener('click', () => {
    document.getElementById("serviceForm").reset();

    const tableBody = document.querySelector('table tbody');
    while (tableBody.rows.length > 1) {
        tableBody.deleteRow(1);
    }

    document.querySelector('#errorBox').innerHTML = '';
    document.querySelectorAll('.error-border').forEach(el => el.classList.remove('error-border'));

    modal.classList.remove("modal-active");
    closeServicePopup();
});

confirmNo.addEventListener('click', () => {
    modal.classList.remove("modal-active");
});

//populate forms
function addNameAndDesc(name, desc){
    document.getElementById("serviceName").value = name;
    document.getElementById("serviceDescription").value = desc;
}
const wash = document.getElementById('washBtn');
wash.addEventListener('click', function() {addNameAndDesc("Wash", "Wash clothes at our shop!");});

const dry = document.getElementById('dryBtn');
dry.addEventListener('click', function() {addNameAndDesc("Dry", "Dry clothes at our shop!")});

const deliver = document.getElementById('deliverBtn');
deliver.addEventListener('click', function() {addNameAndDesc("Deliver", "Wash and Dry on Delivery")});
