const host = "http://localhost:8080";

// Send a request to the server with a path, method, and body
// The method and body are optional
function request(path, method, body) {
    // Get the token from local storage
    const token = localStorage.getItem("Token");
    // Create the request
    const request = new Request(host + "/api/" + path, {
        method: method,
        headers: {
            "Token": token
        },
        body: body
    });
    // Send the request
    return fetch(request);
}