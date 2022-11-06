var register = false;

function do_login() {
    // Get username and password from the form

    var username = $("#username").val();
    var password = $("#password").val();

    request("/accounts/login", "POST", {
        "username": username,
        "password": password
    }).then((data) => {
        data.json().then((value) => {

            // Check if the response is OK
            if (data.status !== 200) {
                $("#error").text(value.message);
                $("#error").show();
                // If not, the login failed
                console.log("Login failed: " + value.message);
                return;
            }
            // Save the token
            saveToken(value.token);
            // If the login was successful, redirect to the home page
            window.location.href = "index.html";
        });
    }
    ).catch((error) => {
        // Make the error message visible
        $("#error").text("Login failed");
        $("#error").css("display", "block");
        // If there was an error, the login failed
        console.log("Login failed", error);
    });
}

function do_register() {
    // Get username and password from the form
    var username = $("#username").val();
    var password = $("#password").val();

    // Get the full name from the form
    var fullname = $("#fullname").val();

    request("/accounts/create", "PUT", {
        "username": username,
        "password": password,
        "fullname": fullname
    }).then((data) => {
        if (data.status === 204) {
            // Account already exists
            $("#error").text("Account already exists");
            $("#error").css("display", "block");
            return;
        }

        data.json().then((value) => {
            // Check if the response is OK
            if (data.status !== 201) {
                // If not, the registration failed
                $("#error").text(value.message);
                $("#error").show();
                console.log("Registration failed: " + value.message);
                return;
            }
            // Login
            do_login();
        });
    }).catch((error) => {
        // Make the error message visible
        $("#error").text("Registration failed");
        $("#error").css("display", "block");
        // If there was an error, the registration failed
        console.log("Registration failed", error);
    });
}



$(document).ready(function () {
    $("#login").click(function (event) {
        event.preventDefault();
        if (register) {
            do_register();
        }
        else {
            do_login();
        }
    });
    $("#register").click(function (event) {
        event.preventDefault();
        if (!register) {
            register = true;
            $("#fullname-field").show();
            $("#register").val("Sign In");
            $("#login").val("Register");
        }
        else {
            register = false;
            $("#fullname-field").hide();
            $("#register").val("Register");
            $("#login").val("Sign In");
        }
    });
    // Hide the error message
    $("#error").hide();
    $("#fullname-field").hide();
    // Hide the error message when the user clicks the username or password field
    $("#username").click(function () {
        $("#error").css("display", "none");
    });
    $("#password").click(function () {
        $("#error").css("display", "none");
    });

});

function main() {
    request("/accounts/test", "GET").then((response) => {
        // Check if the response is OK
        if (response.status === 200) {
            // If not, the token is invalid
            console.log("User is already logged in");
            // Redirect to the login page
            window.location.href = "/index.html";
            return;
        }
        load_images();
    }).catch((error) => {
        // Ignore errors
    });

}
