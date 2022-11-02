var host = "http://0.0.0.0:8080";

// Check if host and the page share the same origin
{
    let url = new URL(host);
    if (url.origin == window.location.origin) {
        host = "";
    }
}

// Send a request to the server with a path, method, and body
// The method and body are optional
function request(path, method, body, cache = false) {
    // Get the token from local storage
    const token = localStorage.getItem("Token");
    var request;
    // Create the request
    if (body == undefined) {
        request = new Request(host + "/api" + path, {
            method: method,
            headers: {
                "Token": token,
            },
        });
    }
    else {
        request = new Request(host + "/api" + path, {
            method: method,
            headers: {
                "Token": token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });
    }

    // Send the request
    return fetch(request, { cache: cache ? "force-cache" : "default" });
}

// Save the token to local storage
function saveToken(token) {
    localStorage.setItem("Token", token);
}
