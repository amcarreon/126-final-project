<?php
require_once '126-final-project/config/constants.php';

    function validate_email($email) {
        // Validation of format
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            //return "Invalid email format.";
            return false;
        }

        // Checking for duplicates
        $findDupe = $conn->prepare("SELECT email FROM Users WHERE email = ?");
        $findDupe->bind_param("s", $email);
        $findDupe->execute();
        $res = $findDupe->get_result();

        if($res->num_rows > 0) {
            //return "Email already exists.";
            return false;
        }
            
    }

    function validate_password($password) {
        // Regex
        $hasUppercase = preg_match('/[A-Z]/', $password);
        $hasNum = preg_match('/[0-9]/', $password);
        $hasSpecial = preg_match('/[^a-zA-Z\d]/', $password);

        // Validations
        if (strlen($password)<PASSWORD_MIN_LENGTH) {
            //return "Password must be at least " . PASSWORD_MIN_LENGTH . " characters.";
            return false;
        }

        if (PASSWORD_REQUIRE_UPPERCASE && !$hasUppercase) {
            //return "Password must have at least 1 uppercase letter.";
            return false;
        }

        if (PASSWORD_REQUIRE_NUMBERS && !$hasNum) {
            //return "Password must have at least 1 number letter.";
            return false;
        }

        if (PASSWORD_REQUIRE_SPECIAL && !$hasSpecial) {
            //return "Password must have at least 1 special character.";
            return false;
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