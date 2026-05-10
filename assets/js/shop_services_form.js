validateForm = () => {
    const serviceName = document.getElementById('serviceName').value.trim();
    const serviceDescription = document.getElementById('serviceDescription').value.trim();
    const serviceSpecifications = document.getElementsByName('serviceSpecification');
    const servicePrices = document.getElementsByName('servicePrice');
    if (!serviceName) {
        errors.push('Service name is required.');
        return false;
    }
    if (!serviceDescription) {
        document.getElementById('service-input').style.borderColor = 'red';
    }
    for (let i = 0; i < serviceSpecifications.length; i++) {
        if (!serviceSpecifications[i].value.trim()) {
            errors.push('Please fill in all service specifications.');
            return false;
        }
        if (!servicePrices[i].value.trim()) {
            errors.push('Please fill in all service prices.');
            return false;
        }
    }
    return true;
};
let counter = 0;
const addRow = () => {
    counter++;
    const table = document.querySelector('table tbody');
    const newRow = table.insertRow()
    

    const serviceCell = newRow.insertCell(0);
    serviceCell.innerHTML = '<input type="text" id="serviceSpecification_${rowCounter} name="serviceSpecification" placeholder="Specification (Ex. 5 kg)" required>';
    
    const priceCell = newRow.insertCell(1);
    priceCell.innerHTML = '<input type="number" id=servicePrice_${rowCounter} name="servicePrice" placeholder="Price" min="0" required>';

    const actionCell = newRow.insertCell(2);
    actionCell.innerHTML = `
        <button class="btn-delete" onclick="removeRow(this)">Delete</button>
    `;
};
const removeRow = (btn) => {
    const row = btn.closest('tr');
    row.parentNode.removeChild(row);
};
function saveService() {
    if (validateForm()) {
        errors.push('Service saved successfully!');
    } else {
        errors.push('Please correct the errors in the form.');
    }
}