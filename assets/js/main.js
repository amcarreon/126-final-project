
const name = document.getElementById('register_name').value;
const email = document.getElementById('register_email').value;
const password = document.getElementById('register_password').value;
const confirmPassword = document.getElementById('confirm_password').value;
function validateForm(name, email, password, confirmPassword) {
    let isValid = true;
  if (!name || !email || !password || !confirmPassword) {
    alert('Please fill in all fields.');
    return false;
  } 
    if(name == ""){
        isValid = false;
        alert("Name must be entered");
    }else if(name.length <= 5){
        isValid = false;
        alert("Name must have greater than 5 characters");
    }else if(name.includes(" ") == false){
        isValid = false;
        alert("Please write your full name.");
    }
    if (email === "") {
    isValid = false;
    alert("Email must be entered");
  } else {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        isValid = false;
        alert("Please enter a valid email address.");
      }
    }
    if (password.length < 6) {
      alert('Password must be at least 6 characters long.');
      return false;
    } 
    if (password !== confirmPassword) {
      alert('Passwords do not match.');
      return false;
    }
    return isValid;
}

