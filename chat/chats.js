url = "wss://tutorial-worker.pvanoostveenneo2.workers.dev/wschat"  // "ws://localhost:8080/wschat"
let hashPass = "1a069ff25f963e4763031a086c99606e842a6d5e3ad79f2a42ac2911692c9692";

let ws;

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

async function loadHandler() {
    let password = document.getElementById("password").value;
    let box = document.getElementById("chatBox");

    hash = await Hash(password);
    console.log(hash);
    if (password == "") {
        box.innerHTML = "Enter password";
    } else if (hash == hashPass) {
        let data = {
            type: "load",
            password: password
        }
        ws.send(JSON.stringify(data));
    } else {
        box.innerHTML = "Wrong password";
    }
}

async function loadChat(data) {
    let msgNum = document.getElementById("numMessages").value;
    let box = document.getElementById("chatBox");

    text = JSON.parse(data);


    console.log(text);
    console.log(text.length);

    if (msgNum > text.length || msgNum == 0) {
        msgNum = text.length;
    }

    let completeMsg = "<tr><td>";
    for (let i = text.length - msgNum; i < text.length; i++) {


        if (text[i].time == undefined) {
            text[i].time = 0;
        }

        let time = new Date(Math.floor(text[i].time));
        date = time.toLocaleDateString() + " " + time.getHours() + ":" + time.getMinutes().toString().padStart(2, "0");

        text[i].name = (text[i].name).replace(/</g, "&lt;").replace(/>/g, "&gt;") // prevent xss
        text[i].msg = (text[i].msg).replace(/</g, "&lt;").replace(/>/g, "&gt;") // prevent xss

        currentUser = document.getElementById("name").value;
        const replaceMentions = (msg) => {
            return msg.replace(/@(\w+)/g, (match, username) => {
                if (username === currentUser) {
                    return `<span style="background-color: var(--primary-color); color: var(--title-color)">@${username}</span>`;
                } else {
                    return `<span style="color: var(--title-color)">@${username}</span>`;
                }
            });
        };

        // Replace mentions in the message
        text[i].msg = replaceMentions(text[i].msg);

        const urlRegex = /(https?:\/\/(?:www\.|(?!www))[^\s.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})/gi;
        text[i].msg = text[i].msg.replace(urlRegex, '<a href="$1" target="_blank">$1</a>');

        text[i].msg = text[i].msg.replace(/www.(\w+)/g, 'https://$1');


        if (i == text.length - msgNum || text[i].name != text[i - 1].name) {

            if (text[i].name == "luna" || text[i].name == "esther") {
                completeMsg += "<br></td> </tr><tr> <td class='top'><img class='chatPic' src='profiles/" + text[i].name + ".png'></td> <td class='chatMsg'><b style='color: var(--link-color)'>" + text[i].name + "&#128187 </b> <span class='chatDate'>" + date + " </span><br>" + text[i].msg + "<br>";
            }
            else {
                completeMsg += "<br></td> </tr><tr> <td class='top'><img class='chatPic' src='profiles/" + text[i].name + ".png'></td><td class='chatMsg'><b style='color: var(--title-color)'>" + text[i].name + "</b> <span class='chatDate'>" + date + " </span><br>" + text[i].msg + "<br>";
            }

        }
        else {
            completeMsg += text[i].msg + "<br>";
        }
    }

    box.innerHTML = "<colgroup><col style='width: 35px;'><col style='max-width: 100%;'></colgroup>" + completeMsg + "<br></td></tr>";

    window.location.href = '#chatInput';
}

async function socket() {
    ws = new WebSocket(url);

    ws.onopen = function (event) {
        console.log("Connected");
        loadHandler();
    }

    ws.onmessage = function (event) {
        console.log(event.data);

        loadChat(event.data);
    }

    ws.onerror = function (event) {
        event.preventDefault();
        console.log("Error");
    }

    ws.onclose = function (event) {
        event.preventDefault();
        console.log("Disconnected");
    }
}

document.addEventListener("DOMContentLoaded", socket)
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
    this.value = "";
    let response = "";


    if (hash == hashPass) {
        a = new Date();
        a = a.getTime();

        let data = {
            type: "send",
            password: password,
            name: name,
            personalPassword: personalPassword,
            msg: msg,
            time: a
        }

        console.log(data);

        ws.send(JSON.stringify(data));
    }
    else {
        box.innerHTML = "Wrong password";
        return;
    }
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

    console.log(response);
}

let register = document.getElementById("register");
register.addEventListener("click", function () {
    let username = document.getElementById("name").value;
    let personalPassword = document.getElementById("personalPassword").value;

    registerUser(username, personalPassword);
});


function startLoop() {
    autoRefresh = document.getElementById("autoRefresh").checked;

    if (autoRefresh) {
        loadHandler();

        setTimeout(startLoop, 2000);
    }
}

autoRefresh = document.getElementById("autoRefresh");
autoRefresh.addEventListener("change", startLoop);


numMessages = document.getElementById("numMessages");
numMessages.addEventListener("change", loadHandler);