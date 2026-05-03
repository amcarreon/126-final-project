<?php

function register_user($email, $full_name, $password, $user_type, $phone_number) {
    global $conn;

    $hashed_pass = password_hash($password, PASSWORD_DEFAULT);

    $sql = "INSERT INTO users (email, full_name, pass, phone_number, user_type)
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