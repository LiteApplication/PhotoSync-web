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
        rotation += 10;
        event.target.style.transform = "rotate(" + rotation + "deg)";
    }, 1000 / 60);
    request("/files/refesh-index", "PATCH", undefined, false, "high").then(
        () => {
            clearInterval(anim);
            event.target.style.transform = "rotate(0deg)";
        }

    )
}