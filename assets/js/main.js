document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('signUp');
    const passwordInput = document.getElementById('register_password');
    const toggleBtn = document.getElementById('toggle_password');
    const registerBtn = document.getElementById('register_button');
    const errorMsg = document.getElementById('error-message');
    const successMsg = document.getElementById('success-message');

    // Password requirements
    const requirements = {
        'length-check': (pwd) => pwd.length >= 8,
        'uppercase-check': (pwd) => /[A-Z]/.test(pwd),
        'number-check': (pwd) => /[0-9]/.test(pwd),
        'special-check': (pwd) => /[^a-zA-Z\d]/.test(pwd)
    };

    // Toggle password visibility
    toggleBtn.addEventListener('click', function(e) {
        e.preventDefault();
        const type = passwordInput.type === 'password' ? 'text' : 'password';
        passwordInput.type = type;
    });

    // Real-time password validation
    passwordInput.addEventListener('input', function() {
        let allMet = true;

        for (const [id, validator] of Object.entries(requirements)) {
            const element = document.getElementById(id);
            const isMet = validator(passwordInput.value);
            
            if (isMet) {
                element.classList.add('met');
            } else {
                element.classList.remove('met');
                allMet = false;
            }
        }

        // Enable button only if all requirements met
        registerBtn.disabled = !allMet;
    });

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        errorMsg.textContent = '';
        successMsg.textContent = '';
        registerBtn.disabled = true;
        registerBtn.textContent = 'Creating...';

        // Prepare data
        const formData = new FormData();
        formData.append('register_name', document.getElementById('register_name').value);
        formData.append('register_email', document.getElementById('register_email').value);
        formData.append('register_password', passwordInput.value);

        // Send to backend via AJAX
        fetch('../../pages/auth/register.php', {
            method: 'POST',
            body: formData,
            credentials: 'same-origin',
            cache: 'no-store',
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                successMsg.textContent = 'Account created! Redirecting...';
                setTimeout(() => {
                    window.top.location.href = '/126-final-project/views/seller/shop_info_form.html';
                }, 1500);
            } else {
                errorMsg.textContent = data.error || 'Registration failed. Please try again.';
                registerBtn.disabled = false;
                registerBtn.textContent = 'Create Account';
            }
        })
        .catch(error => {
            errorMsg.textContent = 'Network error. Please try again.';
            registerBtn.disabled = false;
            registerBtn.textContent = 'Create Account';
        });
    });
});