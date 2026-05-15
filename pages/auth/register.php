<?php
session_start();
require_once '../../includes/auth_functions.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST'){
    $email = sanitize($_POST['register_email']);
    $full_name = sanitize($_POST['register_name']);
    $password = $_POST['register_password'];

    $action = register_user ($email, $full_name, $password);

     if ($user_id) {

        $_SESSION['user_id'] = $user_id;
        $_SESSION['email'] = $email;
        $_SESSION['full_name'] = $full_name;

        header("Location: ../seller/shop_info_form.html");
        exit;

    } else {
        $error = "Registration failed.";
    }
}

include __DIR__ . '/../../views/auth/register_form.php';
?>