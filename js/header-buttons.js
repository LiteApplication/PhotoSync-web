function button_home() {
    window.scrollTo({
        "behavior": "smooth",
        "top": 0,
        "left": 0
    });
}

function button_switch_index() {
    // Change the target of the token (it will point to "<index>" account)
    request("/admin/switch-index", "PATCH", cache = false).then(() => {
        // Reload the page to apply the modifications
        document.location.href = "/index.html"
    })
}

function button_logout() {
    request("/accounts/logout", "POST", undefined, false, "high").then(() => {
        // Reload the page to apply the modifications
        document.location.href = "/login.html"
    });
    localStorage.setItem("Token", undefined);
}

function button_refresh(event) {
    var rotation = 0;
    var anim = setInterval(() => {
        rotation += 8;
        event.target.style.transform = "rotate(" + rotation + "deg)";
    }, 1000 / 25);
    request("/files/reload", "PATCH", undefined, false, "high").then(
        () => {
            clearInterval(anim);
            event.target.style.transform = "rotate(0deg)";
            document.location.reload();
        }

    )
}

const _htmlDecode = (input) => {
    const e = document.createElement('textarea');
    e.innerHTML = input;
    return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
}

function button_change_owner() {
    // Get all the files with the "selected" class
    var files = document.getElementsByClassName("selected");
    // Create a list of the files
    var files_list = [];
    for (var i = 0; i < files.length; i++) {
        files_list.push(files[i].getAttribute("id"));
    }

    // Ask the user to select a user
    user_picker().then((user) => {
        // Change the owner of the files
        request("/files/set-owner", "PATCH", {
            "files": files_list,
            "owner": _htmlDecode(user)
        }, false, "hight").then(() => {
            // Reload the page to apply the modifications
            document.location.reload();
        }
        )
    });
}