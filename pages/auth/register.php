<?php
session_start();
require_once '../../includes/auth_functions.php';
require_once '../../includes/utility_functions.php';

// Set JSON response header
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST'){
    $email = sanitize($_POST['register_email'] ?? '', 'email');
    $full_name = sanitize($_POST['register_name'] ?? '', 'name');
    $password = $_POST['register_password'] ?? '';

    // Validate email and password
    if (!validate_email($email)) {
        echo json_encode(['success' => false, 'error' => 'Invalid email or email already exists.']);
        exit;
    }

    if (!validate_password($password)) {
        echo json_encode(['success' => false, 'error' => 'Password does not meet requirements.']);
        exit;
    }

    // Try to register
    $user_id = register_user($email, $full_name, $password);

    if ($user_id) {
        session_regenerate_id(true);
        $_SESSION['user_id'] = (int) $user_id;
        $_SESSION['email'] = $email;
        $_SESSION['full_name'] = $full_name;

        echo json_encode(['success' => true, 'message' => 'Registration successful!']);
        exit;
    } else {
        echo json_encode(['success' => false, 'error' => 'Registration failed. Please try again.']);
        exit;
    }
} else {
    echo json_encode(['success' => false, 'error' => 'Invalid request method.']);
    exit;
}
?>