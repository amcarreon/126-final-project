<?php
require_once '126-final-project/database/byteXpress_schema.sql';
require_once '126-final-project/includes/auth_functions.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST'){
    $email = sanitize($_POST['email']);
    $full_name = sanitize($_POST['name']);
    $password = $_POST['password'];
    $phone_number = $_POST['phone'];
    $user_type = $_POST['userRole'];

    $action = register_user ($email, $full_name, $password, $phone_number, $user_type);

    if ($action) {
        header("Location: login.php?registered=true");
    }
    else {
        $error = "Registration failed.";
    }
}

include '126-final-project/views/auth/register_form.html';
?>