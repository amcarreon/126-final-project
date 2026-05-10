<?php
require_once '../../includes/auth_functions.php';
require_once '../../includes/utility_functions.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST'){
    $email = sanitize($_POST['register_email'], 'email');
    $full_name = sanitize($_POST['register_name'], 'name');
    $password = $_POST['register_password'];

    $action = register_user ($email, $full_name, $password);

    if ($action) {
        header("Location: login.php?registered=true");
        exit;
    }
    else {
        $error = "Registration failed.";
    }
}

include __DIR__ . '/../../views/auth/register_form.php';
?>