const registrationForm = document.getElementById('signUp'); 
const nameInput = document.getElementById('register_name');
const emailInput = document.getElementById('register_email');
const passwordInput = document.getElementById('register_password');
/*const confirmInput = document.getElementById('confirm_password');*/

function validateForm() {
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    /*const confirmPassword = confirmInput.value;*/

    let isValid = true;

    // Check for empty fields
    if (!name || !email || !password /*|| !confirmPassword*/) {
        alert('Please fill in all fields.');
        return false; 
    }

    // Name Validation
    if (name.length <= 5) {
        alert("Name must have greater than 5 characters");
        isValid = false;
    } else if (!name.includes(" ")) {
        alert("Please write your full name (include a space).");
        isValid = false;
    }

    // Email Validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        alert("Please enter a valid email address.");
        isValid = false;
    }

    // Password Validation
    if (password.length < 6) {
        alert('Password must be at least 6 characters long.');
        isValid = false;
    } /*else if (password !== confirmPassword) {
        alert('Passwords do not match.');
        isValid = false;
    }*/

    return isValid;
}
//if validation fails, prevent form submission
registrationForm.addEventListener('submit', function(event) {
    if (!validateForm()) {
        event.preventDefault();
    }
});

const form = document.querySelector('#signUp');

form.addEventListener('submit', function(event) {
  const isValid = validateForm(); 
  if (!isValid) {
    event.preventDefault(); 
  }
});