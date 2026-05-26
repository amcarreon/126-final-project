<?php
require_once '../../config/database.php';
require_once 'utility_functions.php';

function register_user($email, $full_name, $password) {
    global $conn;

    $valid_email = validate_email($email);
    $valid_pass = validate_password($password);

    if (!$valid_email && !$valid_pass) {
        return;
    }

    $hashed_pass = password_hash($password, PASSWORD_DEFAULT);

    $sql = "INSERT INTO users (email, full_name, password_hash)
            VALUES (?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sss", $email, $full_name, $hashed_pass);

    if ($stmt->execute()) {
        return (int) $conn->insert_id;
    }

    return false;
}

?>