url = "https://tutorial-worker.pvanoostveenneo2.workers.dev/chat/"
let hashPass = "1a069ff25f963e4763031a086c99606e842a6d5e3ad79f2a42ac2911692c9692";


async function Hash(string) {
    const encoder = new TextEncoder();
    const arrayBuffer = encoder.encode(string);

    const hashAsArrayBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);


    const uint8ViewOfHash = new Uint8Array(hashAsArrayBuffer);

    const hashAsString = Array.from(uint8ViewOfHash)
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
    return hashAsString;
}

async function loadHandler(event) {
    let box = document.getElementById("chatBox");
    let msgNum = document.getElementById("numMessages").value;
    let password = document.getElementById("password").value;

    hash = await Hash(password);
    console.log(hash);
    if (password == "") {
        box.innerHTML = "Enter password";
    } else if (hash == hashPass) {
        let response = await fetch(url + password);
        let data = await response.text();
        text = JSON.parse(data);

        console.log(text);
        console.log(text.length);

        if (msgNum > text.length || msgNum == 0) {
            msgNum = text.length;
        }

        let completeMsg = "";
        for (let i = text.length - msgNum; i < text.length; i++) {
            completeMsg += text[i].name + ": " + text[i].msg + "<br>";
        }

        box.innerHTML = completeMsg;

        window.location.href = '#chatInput';
    } else {
        box.innerHTML = "Wrong password";
    }
}

document.addEventListener("DOMContentLoaded", loadHandler)
refresh = document.getElementById("refresh");
refresh.addEventListener("click", loadHandler);
inputPassword = document.getElementById("password");
inputPassword.addEventListener("keyup", loadHandler);

async function chatHandler(event) {
    if (event.key != "Enter") {
        return;
    }

    let name = document.getElementById("name").value;
    let password = document.getElementById("password").value;
    let personalPassword = document.getElementById("personalPassword").value;
    let box = document.getElementById("chatBox");
    let hash = await Hash(password);

    let msg = this.value;
    let msgNum = document.getElementById("numMessages").value;
    this.value = "";
    let response = "";


    if (hash == hashPass) {

        let data = {
            name: name,
            personalPassword: personalPassword,
            msg: msg
        }

        response = await fetch(url + password, {
            method: "POST",
            body: JSON.stringify(data)
        });
    }
    else {
        box.innerHTML = "Wrong password";
        return;
    }

    let data = await response.text();
    console.log(data);
    text = JSON.parse(data);
    console.log(text);

    console.log(text);
    console.log(text.length);

    if (msgNum > text.length || msgNum == 0) {
        msgNum = text.length;
    }

    let completeMsg = "";
    for (let i = text.length - msgNum; i < text.length; i++) {
        completeMsg += text[i].name + ": " + text[i].msg + "<br>";
    }

    box.innerHTML = completeMsg;
}

let chat = document.getElementById("chatInput");
chat.addEventListener("keyup", chatHandler);

async function registerUser(username, personalPassword) {
    let password = document.getElementById("password").value;

    let data = {
        name: username,
        personalPassword: personalPassword,
    }

    response = await fetch("https://tutorial-worker.pvanoostveenneo2.workers.dev/newuser/" + password, {
        method: "POST",
        body: JSON.stringify(data)
    });
}