<?php
require_once __DIR__ . '/admin_auth.php';

admin_session_start();
$_SESSION = [];
session_destroy();

header('Location: /126-final-project/views/auth/admin_login_form.html');
exit;
