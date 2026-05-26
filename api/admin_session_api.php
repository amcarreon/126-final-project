<?php
require_once '../includes/admin_auth.php';

header("Content-Type: application/json");

admin_session_start();

echo json_encode([
    "success" => true,
    "logged_in" => is_admin_logged_in(),
    "admin_id" => get_admin_id() ?: null
]);
