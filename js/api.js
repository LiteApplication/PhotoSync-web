var host = "${API_HOST}";

// Check if host and the page share the same origin
{
    let url = new URL(host);
    if (url.origin == window.location.origin) {
        host = "";
    }
    console.log("Using host : " + host);
}

// Send a request to the server with a path, method, and body
// The method and body are optional
function request(path, method, body, cache = false, priority = "low") {
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
    return fetch(request, { cache: cache ? "force-cache" : "default", priority: priority });
}

// Save the token to local storage
function saveToken(token) {
    localStorage.setItem("Token", token);
}

// Get a user list "/accounts/get-users"
function getUsers() {
    return new Promise((resolve, reject) => {
        request("/accounts/get-users", "GET").then((response) => {
            if (response.status == 200) {
                response.json().then((data) => {
                    resolve(data.users);
                });
            }
            else {
                reject(response.status);
            }
        });
    });
}

// Get a user "/accounts/get-user"
function getUser(username) {
    return new Promise((resolve, reject) => {
        request("/accounts/get-user/" + username, "GET").then((response) => {
            if (response.status == 200) {
                response.json().then((data) => {
                    resolve(data.user);
                });
            }
            else {
                reject(response.status);
            }
        });
    });
}