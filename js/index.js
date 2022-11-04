const thumbnail_size = 128;
const screens_to_load = 2;

// Number of thumbnails left before loading more
const boder_threshold = 4;

// Calculate the amount of images that can fit on the screen
var images_per_row = Math.floor(window.innerWidth / thumbnail_size);
// Calculate the amount of rows that can fit on the screen
var images_per_col = Math.floor(window.innerHeight / thumbnail_size);
// The amount of images that can fit on the screen
var thumbnails_to_load = Math.max(screens_to_load * images_per_row * images_per_col + images_per_row, 1);

var last_image = { id: null };

var loading_screen = true;
var _is_loading_images = false;
var _loaded_all_images = false;

var years_nodes = {};
var month_nodes = {}

const MONTHS_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function unix_timestamp_to_month_year(timestamp) {
    // Return the month and year of a unix timestamp
    // The timestamp is in seconds
    // The month is in letters

    // Create a date object
    var date = new Date(timestamp * 1000);
    // Get the month
    var month = date.getMonth();
    // Get the year
    var year = date.getFullYear();
    // Return the month and year
    return [month, year];
}

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
        console.error("Token is invalid :" + error);
        // Redirect to the login page
        throw error;
        window.location.href = "login.html";
    });

    // Check if the user is an admin
    request("/admin/test", "GET").then((response) => {
        // Check if the response is OK
        if (response.status !== 200) {
            // If not, the user is not an admin
            console.log("User is not an admin");
            // Remove the admin button
            while (document.getElementsByClassName("admin-button")) {
                document.getElementsByClassName("admin-button")[0].remove();
            }
        }
        return;
    }).catch((error) => {
        // Remove the admin button
        while (document.getElementsByClassName("admin-button")) {
            document.getElementsByClassName("admin-button")[0].remove();
        }
        console.error("Error while checking admin :" + error);
    });
}


// On scroll, check if the user has scrolled to the bottom of the page
// Do not load more images if the user is already loading images
_should_load_images = false;
window.onscroll = function () {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - boder_threshold * thumbnail_size) {
        if (_is_loading_images) {
            _should_load_images = true;
        } else {

            load_images();
        }

    }
};


function end_loading() {
    if (loading_screen) {
        // Remove the loading screen
        loading_screen = false;
        document.getElementById("loading").remove();
    }
}

function get_month_node(timestamp) {
    // Get the node for a year / month

    var month, year;
    [month, year] = unix_timestamp_to_month_year(timestamp);

    // Check if the node exists
    if (years_nodes[year] === undefined) {
        // Calculate the the first second of the year
        var first_second = new Date(year, 0, 1).getTime() / 1000;

        // If not, create the node
        var year_node = document.createElement("div");
        year_node.className = "year";
        year_node.setAttribute("timestamp", first_second);
        var year_title = document.createElement("div");
        year_title.className = "year-title";
        var year_header = document.createElement("h2");
        year_header.innerText = year;
        var year_expand = document.createElement("span");
        year_expand.className = "material-symbols-outlined";
        year_expand.innerText = "expand_more";
        year_title.appendChild(year_header);
        year_title.appendChild(year_expand);
        year_node.appendChild(year_title);
        years_nodes[year] = year_node;
        month_nodes[year] = {};
        document.getElementById("main-pictures").appendChild(year_node);

        year_title.addEventListener("click", () => {
            // Toggle the year
            year_node.classList.toggle("year-collapsed");
            year_expand.innerText = year_node.classList.contains("year-collapsed") ? "expand_less" : "expand_more";
            if (year_node.classList.contains("year-collapsed")) {
                // Load images after the month collapsed month if needed
                load_images_time();
            }
        });
    }
    // Check if the month node exists
    if (month_nodes[year][month] === undefined) {
        // Calculate the the first second of the month
        var first_second = new Date(year, month, 1).getTime() / 1000;


        // If not, create the node
        var month_node = document.createElement("div");
        month_node.className = "month";
        month_node.setAttribute("timestamp", first_second);
        // Add a title bar
        var month_title = document.createElement("div");
        month_title.className = "month-title";
        // Add a title
        var month_header = document.createElement("h3");
        month_header.innerText = MONTHS_NAMES[month];
        // Make it retractable
        var month_expand = document.createElement("span");
        month_expand.className = "material-symbols-outlined";
        month_expand.innerText = "expand_more";

        // Add the images container
        var images_node = document.createElement("div");
        images_node.className = "images";

        // Put everything together
        month_title.appendChild(month_header);
        month_title.appendChild(month_expand);
        month_node.appendChild(month_title);
        month_node.appendChild(images_node);
        month_nodes[year][month] = images_node;
        years_nodes[year].appendChild(month_node);

        month_title.addEventListener("click", () => {
            // Toggle the month
            month_node.classList.toggle("month-collapsed");
            month_expand.innerText = month_node.classList.contains("month-collapsed") ? "expand_less" : "expand_more";
            if (month_node.classList.contains("month-collapsed")) {
                // Load images after the month collapsed month if needed
                load_images_time();
            }
        });
    }
    // Return the month node
    return month_nodes[year][month];
}

function load_image(image) {

    // Create the div
    var div = document.createElement("div");
    div.className = "image";
    div.setAttribute("id", image.id);
    div.style.backgroundColor = image.color;
    // Create the image
    var img = document.createElement("img");
    img.style.opacity = 0;

    // Add the image to the div
    div.appendChild(img);
    // Add the div to the page
    get_month_node(image.date).appendChild(div);
    // Download the image
    request("/timg/get/" + image.id + "/" + thumbnail_size, "GET", undefined, cache = true).then((response) => {
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

    div.onclick = () => { open_viewer(image); }

}


function load_images(req = null) {
    if (_loaded_all_images || _is_viewer_open) {
        return;
    }

    // Create a div for each image
    var images = [];
    _is_loading_images = true;

    if (req === null) {
        req = request("/files/file-list/id/" + last_image.id + "/" + thumbnails_to_load, "GET", undefined, cache = false, priority = "high")
    }

    req.then((response) => { return response.json(); }).then((data) => {
        images = data;

        if (images.length == 0) {
            end_loading();
            _is_loading_images = false;
            _loaded_all_images = true;
            console.log("No more images to load");
            return;
        }

        for (var i = 0; i < images.length; i++) {
            // Download the thumbnail and add it to the page
            load_image(images[i]);
        }
        last_image = images[images.length - 1];
        if (_should_load_images) {
            _should_load_images = false;
            load_images();

        }
        _is_loading_images = false;
    }).catch((error) => {
        console.log("Error loading images", error);
    });

}

function load_images_time(force = false) {

    // Check if the user is at the bottom of the page
    if (!(window.innerHeight + window.scrollY >= document.body.offsetHeight - boder_threshold * thumbnail_size) && !force) {
        return false;
    }



    // Get the timestamp of the last displayed month
    var last_month = document.getElementsByClassName("month")[0];
    while (last_month.nextSibling) {
        console.log(last_month);
        last_month = last_month.nextSibling;
    }
    var timestamp = last_month.getAttribute("timestamp");
    // Check if the last month is collapsed in the year
    var last_month_collapsed = last_month.parentElement.classList.contains("year-collapsed");
    if (last_month_collapsed) {
        // If it is, get the year
        var years = document.getElementsByClassName("year");
        var last_year = years[years.length - 1];
        // Get the timestamp of the year
        timestamp = last_year.getAttribute("timestamp");
    }

    // Get the images from the server
    var req = request("/files/file-list/before/" + timestamp + "/" + thumbnails_to_load, "GET", undefined, cache = false, priority = "high");
    load_images(req);
    return true;
}

window.onload = main