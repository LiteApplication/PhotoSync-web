function main() {
    console.log("Initializing JS ...");

    // Ensure the token is valid
    // Request /api/accounts/test
    request("accounts/test", "GET").then((response) => {
        // Check if the response is OK
        if (response.message !== "OK") {
            // If not, the token is invalid
            console.log("Token is invalid");
            // Redirect to the login page
            window.location.href = "login.html";
            return;
        }
    });





    // Remove the loading screen
    document.getElementById("loading").remove();

}


window.onload = main