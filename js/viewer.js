var _is_viewer_open = false;
var scroll_position = 0;

function open_viewer(image) {

    // Save the current scroll position
    scroll_position = window.scrollY;

    // Get the tag inside the viewer
    var viewer_container = document.getElementById("vcontainer");
    var viewer_node;

    while (viewer_container.firstChild) {
        viewer_container.removeChild(viewer_container.firstChild);
    }



    if (image.type === "video") {
        // If the image is a video, create a video tag
        viewer_node = document.createElement("video");
        viewer_container.appendChild(viewer_node);
        viewer_node.setAttribute("controls", "");
        viewer_node.setAttribute("autoplay", "");
        viewer_node.setAttribute("loop", "");
    } else {
        // If the image is an image, create an image tag
        viewer_node = document.createElement("img");
        viewer_container.appendChild(viewer_node);
    }


    // Open the image in the viewer
    // Get the image
    request("/fileio/download/" + image.id, "GET").then((response) => {
        // Check if the response is OK
        if (response.status !== 200) {
            // If not, the image failed to load
            console.error("Image failed to load");
            return;
        }
        // Get the image data
        response.blob().then((blob) => {
            // Create a URL for the image
            var url = URL.createObjectURL(blob);
            // Set the image source
            viewer_node.src = url;
            // Show the image (add the class to the body)
            // once the image is loaded
            if (image.type === "video") {
                viewer_node.onloadeddata = () => {
                    document.body.classList.add("viewing-image");
                    _is_viewer_open = true;
                }
            } else {

                viewer_node.onload = () => {
                    document.body.classList.add("viewing-image");
                    _is_viewer_open = true;
                }
            }
        });
    }).catch((error) => {
        // If there was an error, the image failed to load
        console.error("Image failed to load", error);
    });

    // Bind the delete button
    document.getElementById("viewer-delete").onclick = () => {
        // Delete the image
        request("/files/delete/" + image.id, "DELETE").then((response) => {
            // Check if the response is OK
            if (response.status !== 200) {
                // If not, the image failed to load
                console.error("Image failed to delete");
                return;
            }
            // Remove the image from the page
            document.getElementById(image.id).remove();
            // Close the viewer
            close_viewer();
        }).catch((error) => {
            // If there was an error, the image failed to load
            throw error;
        });
    }


    // If ESC is pressed, close the viewer
    document.onkeydown = (event) => {
        if (event.key === "Escape") {
            close_viewer();
        }
    }
}

function close_viewer() {
    if (_is_viewer_open) {
        // Close the image
        // Remove the class from the body
        document.body.classList.remove("viewing-image");
        _is_viewer_open = false;
        // Remove the image from the viewer
        var viewer_container = document.getElementById("vcontainer");
        viewer_container.removeChild(viewer_container.firstChild);

        // Scroll back to the previous position
        window.scrollTo(0, scroll_position);
    }
}
