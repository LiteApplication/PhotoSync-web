// Create a toast message
function toast(message, duration = 5000) {
    // Create the toast
    var toast = document.createElement("div");
    toast.classList.add("toast");
    toast.innerHTML = message;

    toast.onclick = function () {
        hide_toast();
    }

    // Add the toast to the page
    document.body.appendChild(toast);

    // Remove the toast after 5 seconds
    setTimeout(() => {
        hide_toast()
    }, duration);

    return toast;
}

function error(message, duration = 5000) {
    toast(message, duration).classList.add("error");
}

function hide_toast() {
    var toasts = document.getElementsByClassName("toast");
    for (var i = 0; i < toasts.length; i++) {
        toasts[i].classList.add("hide");
    }
    setTimeout(() => {
        toasts = document.getElementsByClassName("toast");
        for (var i = 0; i < toasts.length; i++) {
            toasts[i].remove();
        }
    }, 500);
}


// User picker (return a promise)
function user_picker() {
    return new Promise((resolve, reject) => {
        // Create the dialog
        var dialog = document.createElement("div");
        dialog.classList.add("dialog");
        dialog.classList.add("user-picker");

        // Create the title
        var title = document.createElement("div");
        title.classList.add("title");
        title.innerText = "Select a user";
        dialog.appendChild(title);

        // Create the content
        var content = document.createElement("div");
        content.classList.add("content");
        dialog.appendChild(content);

        // Create the user list
        var list = document.createElement("div");
        list.classList.add("user-list");
        content.appendChild(list);

        // Create the user list
        getUsers().then((users) => {
            for (var i = 0; i < users.length; i++) {
                // Create the user
                var user = document.createElement("div");
                user.classList.add("user");
                user.innerText = users[i].username;
                user.onclick = function () {
                    resolve(this.innerHTML);
                    dialog.remove();
                }
                list.appendChild(user);
            }
        });

        // Create the cancel button
        var cancel = document.createElement("div");
        cancel.classList.add("cancel");
        cancel.innerHTML = "Cancel";
        cancel.onclick = function () {
            reject();
            dialog.remove();
        }
        dialog.appendChild(cancel);

        // Add the dialog to the page
        document.body.appendChild(dialog);
    });
}
