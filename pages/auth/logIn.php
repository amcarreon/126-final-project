<?php
session_start();
require_once '../../config/database.php';

const LOGIN_URL = '/126-final-project/views/auth/login_form.html';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: ' . LOGIN_URL);
    exit;
}

$email = $_POST['login_email'] ?? '';
$password = $_POST['login_password'] ?? '';

$sql = 'SELECT user_id, email, full_name, password_hash FROM users WHERE email = ?';
$stmt = $conn->prepare($sql);

if (!$stmt) {
    die('Prepare failed: ' . $conn->error);
}

$stmt->bind_param('s', $email);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();
$stmt->close();

$loginOk = $user && password_verify($password, $user['password_hash']);

if ($loginOk) {
    $userId = (int) $user['user_id'];

    $shopCheck = $conn->prepare(
        'SELECT shop_id FROM shops WHERE owner_id = ? LIMIT 1'
    );
    $shopCheck->bind_param('i', $userId);
    $shopCheck->execute();
    $hasShop = (bool) $shopCheck->get_result()->fetch_assoc();
    $shopCheck->close();

    if ($hasShop) {
        session_regenerate_id(true);
        $_SESSION['user_id'] = $userId;
        $_SESSION['email'] = $user['email'];
        $_SESSION['full_name'] = $user['full_name'];

        header('Location: /126-final-project/views/seller/shop_profile_manager.html');
        exit;
    }
}

header('Location: ' . LOGIN_URL . '?error=1');
exit;
