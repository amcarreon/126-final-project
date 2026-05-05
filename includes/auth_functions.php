<?php
require_once '126-final-project/config/database.php';
require_once 'utility_functions.php';

function register_user($email, $full_name, $password, $user_type, $phone_number) {
    global $conn;

    $valid_email = validate_email($email)
    $valid_pass = validate_password($password);

    if (!$valid_email && !$valid_pass) {
        return;
    }

    $hashed_pass = password_hash($password, PASSWORD_DEFAULT);

    $sql = "INSERT INTO users (email, full_name, password_hash, phone_number, user_type)
            VALUES (?, ?, ?, ?, ?)"
    $stmt = $conn->prepare();
    $stmt->bind_param("sssss", $email, $full_name, $hashed_pass, $phone_number, $user_type);

    if ($stmt->execute()) {
        return true;
    }
    else {
        return false;
    }
}

?>