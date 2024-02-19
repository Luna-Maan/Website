console.log("Chat.js");
let url = "https://wt.ops.labs.vu.nl/api24/9fd5e7bd"

let beginID;

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
    let box = document.getElementById("chatBox");
    let response = await fetch(url);
    let content = await response.text();

    json = JSON.parse(content);

    console.log(json);

    if (json.length != 0) {
        beginID = json[0]["id"];

        box.innerHTML = "";
        for (let i = 0; i < json.length; i++) {
            message = json[i]["name"] + ": " + json[i]["description"]
            box.innerHTML += message + "<br>";
        }
    }
}

document.addEventListener("DOMContentLoaded", loadHandler)

async function chatHandler(event) {
    if (event.key != "Enter") {
        return;
    }
    let object = {};

    let message = this.value;
    this.value = "";

    let name = document.getElementById("name").value;
    object["name"] = name;
    object["year"] = message;
    object["genre"] = message;
    object["description"] = message;
    object["poster"] = message;

    let json = JSON.stringify(object);

    console.log(json);

    let response = await fetch(url, {
        method: "POST",
        body: json,
        headers: {
            "Content-Type": "application/json"
        }
    });

    loadHandler();
}

let chat = document.getElementById("chatInput");
chat.addEventListener("keyup", chatHandler);

async function resetHandler(event) {
    event.preventDefault();
    let password = document.getElementById("password").value;
    let hash = await Hash(password);
    console.log(hash);
    if (hash == "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8") {
        await fetch(url + "/reset");
        console.log(beginID)
        let promises = [];
        for (let i = beginID; i < beginID + 9; i++) {
            promises.push(fetch(url + "/item/" + i, {
                method: "DELETE"
            }));
        }
        await Promise.all(promises);

        console.log("reset");

        let box = document.getElementById("chatBox");
        box.innerHTML = "";
    }

    this.submit();
}

let reset = document.querySelector("form");
reset.addEventListener("submit", resetHandler);