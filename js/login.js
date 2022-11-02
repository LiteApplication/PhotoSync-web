var register = false;

function login() {
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

$(document).ready(function () {
    $("#login").click(function (event) {
        event.preventDefault();
        login();
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

