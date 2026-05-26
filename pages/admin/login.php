<?php
require_once '../../config/database.php';
require_once '../../includes/admin_auth.php';

const ADMIN_LOGIN_URL = '/126-final-project/views/auth/admin_login_form.html';
const ADMIN_PANEL_URL = '/126-final-project/views/admin/admin_panel.html';

admin_session_start();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: ' . ADMIN_LOGIN_URL);
    exit;
}

$password = $_POST['admin_password'] ?? '';

if ($password === '') {
    header('Location: ' . ADMIN_LOGIN_URL . '?error=1');
    exit;
}

$stmt = $conn->prepare('SELECT admin_id, password_hash FROM admins');
$stmt->execute();
$result = $stmt->get_result();

$authenticated = false;

while ($row = $result->fetch_assoc()) {
    if (password_verify($password, $row['password_hash'])) {
        $_SESSION['admin_id'] = (int) $row['admin_id'];
        $authenticated = true;
        break;
    }
}

$stmt->close();
$conn->close();

if ($authenticated) {
    header('Location: ' . ADMIN_PANEL_URL);
} else {
    header('Location: ' . ADMIN_LOGIN_URL . '?error=1');
}
exit;
