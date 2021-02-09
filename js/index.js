// Attempt to autologin a user
window.onload = function () {
    if (autoLogin())
        return;
    loadHiRes();
    autoFillLogin();

    $("#login-form").on("submit", submitLoginClicked);
};