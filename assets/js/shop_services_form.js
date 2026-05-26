let counter = 0;
const addRow = () => {
    counter++;
    const table = document.querySelector('table tbody');
    const newRow = table.insertRow()
    

    const serviceCell = newRow.insertCell(0);
    serviceCell.innerHTML = '<input type="text" id="serviceSpecification_${counter}" name="serviceSpecification[]" placeholder="Specification (Ex. 5 kg)" required>';
    
    const priceCell = newRow.insertCell(1);
    priceCell.innerHTML = '<input type="number" id="servicePrice_${counter}" name="servicePrice[]" placeholder="Price" min="0" required>';

    const actionCell = newRow.insertCell(2);
    actionCell.innerHTML = `
        <button class="btn-delete" onclick="removeRow(this)">Delete</button>
    `;
};
const removeRow = (btn) => {
    const row = btn.closest('tr');
    row.parentNode.removeChild(row);
};
let errors = [];
const validateForm = () => {
    errors = []; // Clear previous errors
    let isValid = true;

    const setInvalid = (id) => {
        const el = document.getElementById(id);
        if (el) el.classList.add('error-border');
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

    const specs = document.getElementsByName('serviceSpecification');
    const prices = document.getElementsByName('servicePrice');


    Array.from(specs).forEach((spec, i) => {
        if (!spec.value.trim() || !prices[i].value || prices[i].value < 0) {
            errors.push(`Line ${i + 1}: Specification and valid price are required.`);
            isValid = false;
        }
    });
    // console.log("Final Errors:", errors);
    //
    // Debug logs go here
    //console.log("ServiceName:", serviceName);
    //console.log("ServiceDescription:", serviceDescription);
    //console.log("Specs:", specs);
    //console.log("Prices:", prices);
    //console.log("Errors so far:", errors);

    return isValid;
};

/*Save Button with Modal ( for css styling)*/
const form = document.querySelector('#serviceForm');

form.addEventListener('submit', function(event) {
    event.preventDefault(); 

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

        window.location.href = "../../views/seller/services_page.html";
        
    } catch (error) {
        console.error("Error:", error);
        errors.push("An error occurred while saving. Check console for details.");
    }
}

function showErrors(errors) {
    const errorBox = document.querySelector('#errorBox');
    errorBox.innerHTML = errors.map(e => `<p style="color:red;">${e}</p>`).join('');
}

/*Cancel Button with Modal (for css styling)*/

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
    
    modal.classList.remove("modal-active");
});

confirmNo.addEventListener('click', () => {
    modal.classList.remove("modal-active");
});