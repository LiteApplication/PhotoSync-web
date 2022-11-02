const thumbnail_size = 128;
// Calculate the amount of images that can fit on the screen
var images_per_row = Math.floor(window.innerWidth / thumbnail_size);
// Calculate the amount of rows that can fit on the screen
var images_per_col = Math.floor(window.innerHeight / thumbnail_size);
// The amount of images that can fit on the screen
var thumbnails_to_load = images_per_row * (images_per_col + 1);

var last_image = null;

var loading = true;
function main() {
    console.log("Initializing JS ...");

    // Ensure the token is valid
    // Request /api/accounts/test
    request("/accounts/test", "GET").then((response) => {
        // Check if the response is OK
        if (response.status !== 200) {
            // If not, the token is invalid
            console.log("Token is invalid");
            // Redirect to the login page
            window.location.href = "login.html";
            return;
        }
        load_images();
    }).catch((error) => {
        // If there was an error, the token is invalid
        console.log("Token is invalid");
        // Redirect to the login page
        throw error;
        window.location.href = "login.html";
    });

}

function end_loading() {
    if (loading) {
        // Remove the loading screen
        loading = false;
        document.getElementById("loading").remove();
    }
}

function load_image(f_id, color) {

    // Create the div
    var div = document.createElement("div");
    div.className = "image";
    div.style.backgroundColor = color;
    // Create the image
    var img = document.createElement("img");
    img.style.opacity = 0;
    // Add the image to the div
    div.appendChild(img);
    // Add the div to the page
    document.getElementById("main-pictures").appendChild(div);
    // Download the image
    request("/timg/get/" + f_id + "/" + thumbnail_size, "GET", undefined, cache = true).then((response) => {
        // Check if the response is OK
        if (response.status !== 200) {
            // If not, the image failed to load
            console.error("Image failed to load");
            document.getElementById("main-pictures").removeChild(div);
            return;
        }
        // Get the image data
        response.blob().then((blob) => {
            // Create a URL for the image
            var url = URL.createObjectURL(blob);
            // Set the image source
            img.src = url;
            img.style.opacity = 1;
            end_loading();
        });
    }).catch((error) => {
        // If there was an error, the image failed to load
        console.error("Image failed to load", error);
        debugger
    });

}

function load_images() {
    // Create a div for each image

    var images = [];
    request("/files/file-list/" + last_image + "/" + thumbnails_to_load, "GET", undefined, cache = false).then((response) => { return response.json(); }).then((data) => {
        images = data;
        console.log(images);

        if (images.length == 0) {
            end_loading();
            return;
        }

        for (var i = 0; i < images.length; i++) {
            // Download the thumbnail and add it to the page
            load_image(images[i].id);
        }
        last_image = images[images.length - 1].id;
    }).catch((error) => {
        console.log("Error loading images", error);
    });

}

window.onload = main