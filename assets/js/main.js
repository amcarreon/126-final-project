const registrationForm = document.getElementById('signUp'); 
const nameInput = document.getElementById('register_name');
const registerEmailInput = document.getElementById('register_email');
const registerPasswordInput = document.getElementById('register_password');
const loginForm = document.getElementById('logIn');
const loginEmailInput = document.getElementById('login_email');
const loginPasswordInput = document.getElementById('login_password');

/*const confirmInput = document.getElementById('confirm_password');*/

function validateForm() {
    const name = nameInput.value.trim();
    const email = registerEmailInput.value.trim();
    const password = registerPasswordInput.value;
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
    if (emailPattern.test(email)) {
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
  const isValid = validateForm(); 
  if (!isValid) {
    event.preventDefault(); 
  }
});



function validateLogin() {


    
    const email = loginEmailInput.value.trim();
    const password = loginPasswordInput.value.trim();

    let isValid = true;

    // Check for empty fields
    if ( !email || !password ) {
        alert('Please fill in all fields.');
        return false; 
    }

    // Email Validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailPattern.test(email)) {
        alert("Please enter a valid email address.");
        isValid = false;
    }
    if (password.length < 6) {
        alert('Password must be at least 6 characters long.');
        isValid = false;
    }

    return isValid;
}


loginForm.addEventListener('submit', async function(event) {
    event.preventDefault();


    if (validateLogin()) {
        const formData = new FormData(loginForm);

        try {
            const response = await fetch('login_process.php', {
                method: 'POST',
                body: formData
            });

            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                const data = await response.json();
                if (data.success) {
                    window.location.href = "home.php";
                } else {
                    alert(data.message);
                }
            } else {
                const text = await response.text();
                console.log("Server said:", text);
            }
        } catch (error) {
            console.error("Connection error:", error);
        }
    }
});

