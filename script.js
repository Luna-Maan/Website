function getCookies() {
    var cookies = document.cookie.split(';');
    var result = {};

    cookies.forEach(function (cookie) {
        var parts = cookie.split('=');
        var name = parts[0].trim();
        var value = parts[1];
        result[name] = decodeURIComponent(value);
    });

    return result;
}

let allCookies = getCookies();
console.log(allCookies);
if (allCookies["theme"] === "light") {
    document.documentElement.style.setProperty('--primary-color', 'white');
    document.documentElement.style.setProperty('--secondary-color', 'lightgray');
    document.documentElement.style.setProperty('--text-color', 'black');
    document.documentElement.style.setProperty('--navSelected-color', '#333');
    themeSwitch = document.getElementById("theme");
    themeSwitch.checked = true;
}
else if (allCookies["theme"] === "custom") {
    document.documentElement.style.setProperty('--primary-color', allCookies["primary"]);
    document.documentElement.style.setProperty('--secondary-color', allCookies["secondary"]);
    document.documentElement.style.setProperty('--title-color', allCookies["title"]);
    document.documentElement.style.setProperty('--text-color', allCookies["text"]);
    document.documentElement.style.setProperty('--link-color', allCookies["link"]);
    document.documentElement.style.setProperty('--navSelected-color', allCookies["navSelected"]);
} else {
    console.log("dark");
}
document.getElementById("primary").value = allCookies["primary"];
document.getElementById("secondary").value = allCookies["secondary"];
document.getElementById("titleColor").value = allCookies["title"];
document.getElementById("textColor").value = allCookies["text"];
document.getElementById("linkColor").value = allCookies["link"];
document.getElementById("navSelectedColor").value = allCookies["navSelected"];


async function setColor(theme, primary, secondary, title, text, link, navSelected) {
    if (theme === "dark") {
        document.cookie = "theme=dark; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/";
    }
    else if (theme === "custom") {
        document.cookie = "theme=custom; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/";
        if (primary === "" || primary === undefined) {
            primary = "#1a1a1a";
        }
        if (secondary === "" || secondary === undefined) {
            secondary = "#333333";
        }
        if (title === "" || title === undefined) {
            title = "#ff2e2e";
        }
        if (text === "" || text === undefined) {
            text = "white";
        }
        if (link === "" || link === undefined) {
            link = "#2A9134";
        }
        if (navSelected === "" || navSelected === undefined) {
            navSelected = "#111";
        }
        document.cookie = "primary=" + primary + "; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/";
        document.cookie = "secondary=" + secondary + "; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/";
        document.cookie = "title=" + title + "; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/";
        document.cookie = "text=" + text + "; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/";
        document.cookie = "link=" + link + "; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/";
        document.cookie = "navSelected=" + navSelected + "; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/";
    }
    else {
        document.cookie = "theme=light; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/";
    }
    location.reload();
}

submitColor = document.getElementById("submitColor");
submitColor.addEventListener("click", function () {
    let primary = document.getElementById("primary").value;
    let secondary = document.getElementById("secondary").value;
    let title = document.getElementById("titleColor").value;
    let text = document.getElementById("textColor").value;
    let link = document.getElementById("linkColor").value;
    let navSelected = document.getElementById("navSelectedColor").value;
    setColor("custom", primary, secondary, title, text, link, navSelected);
});

themeSwitch = document.getElementById("theme");
themeSwitch.addEventListener("change", function () {
    if (this.checked) {
        setColor("light");
    } else {
        setColor("dark");
    }
});


preset = document.getElementById("presets");
preset.addEventListener("change", function () {
    if (this.value === "light") {
        document.getElementById("primary").value = allCookies["primary"];
        document.getElementById("secondary").value = allCookies["secondary"];
        document.getElementById("titleColor").value = allCookies["title"];
        document.getElementById("textColor").value = allCookies["text"];
        document.getElementById("linkColor").value = allCookies["link"];
        document.getElementById("navSelectedColor").value = allCookies["navSelected"];
    }
    else if (this.value === "dark") {
        document.getElementById("primary").value = "#1a1a1a";
        document.getElementById("secondary").value = "#333333";
        document.getElementById("titleColor").value = "#ff2e2e";
        document.getElementById("textColor").value = "white";
        document.getElementById("linkColor").value = "#2A9134";
        document.getElementById("navSelectedColor").value = "#111";
    }
    else if (this.value === "custom") {
        document.getElementById("primary").value = "white";
        document.getElementById("secondary").value = "lightgray";
        document.getElementById("titleColor").value = allCookies["title"];
        document.getElementById("textColor").value = allCookies["text"];
        document.getElementById("linkColor").value = allCookies["link"];
        document.getElementById("navSelectedColor").value = allCookies["navSelected"];
    }
});