<?php
require_once 'config/constants.php';

    function validate_email($email) {
        if (filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return true;
        }
        else {
            return false;
        }
    }

    function validate_password($password) {
        $hasUppercase = preg_match('/[A-Z]/', $password);
        $hasNum = preg_match('/[0-9]/', $password);
        $hasSpecial = preg_match('/[^a-zA-Z\d]/', $password);

        if (!(strlen($password)>PASSWORD_MIN_LENGTH)) {
            return "Password must be at least " . PASSWORD_MIN_LENGTH . " characters.";
        }

        if (PASSWORD_REQUIRE_UPPERCASE && !$hasUppercase) {
            return "Password must have at least 1 uppercase letter.";
        }

        if (PASSWORD_REQUIRE_NUMBERS && !$hasNum) {
            return "Password must have at least 1 number letter.";
        }

        if (PASSWORD_REQUIRE_SPECIAL && !$hasSpecial) {
            return "Password must have at least 1 special character.";
        }

        return true;
    }

    function sanitize($input, $type = 'default') {
        $input = trim($input);
        $input = stripslashes($input);
        $input = htmlspecialchars($input, ENT_QUOTES, 'UTF-8');

        switch ($type) {
            case 'email':
                return filter_var($input, FILTER_SANITIZE_EMAIL);
            case 'name':
            default:
                return $input;
        }
    }

?>