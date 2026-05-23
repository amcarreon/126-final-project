async function requireAdminSession(redirectOnFail = true) {
    try {
        const res = await fetch(`${BASE}/api/admin_session_api.php`, {
            credentials: "same-origin"
        });
        const data = await res.json();

        if (data.logged_in) {
            return true;
        }
    } catch (err) {
        console.error(err);
    }

    if (redirectOnFail) {
        window.location.href = `${BASE}/views/auth/admin_login_form.html`;
    }
    return false;
}
