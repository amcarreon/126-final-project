<?php

    function validate_email($email) {

    }

    function validate_password($password) {
        
    }

    function sanitize($input, $type = 'default') {
        $input = trim($input);
        $input = stripslashes($input);

        switch ($type) {
            case 'email':
                // to be filled
            case 'name':
                // to be filled
            default:
                return htmlspecialchars(strip_tags($input), ENT_QUOTES, 'UTF-8');
        }
    }

?>