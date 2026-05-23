<?php

function admin_session_start() {
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
}

function is_admin_logged_in() {
    admin_session_start();
    return !empty($_SESSION['admin_id']);
}

function require_admin_json() {
    admin_session_start();
    header("Content-Type: application/json");
    if (empty($_SESSION['admin_id'])) {
        http_response_code(401);
        echo json_encode(["success" => false, "message" => "Admin login required"]);
        exit;
    }
}

function get_admin_id() {
    admin_session_start();
    return (int) ($_SESSION['admin_id'] ?? 0);
}
