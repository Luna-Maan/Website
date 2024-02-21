// resetting chat and getting a new key
// 1. reset chat through the reset button
// 2. use keygen to generate a new key


console.log("Chat.js");
let url = "https://wt.ops.labs.vu.nl/api24/9fd5e7bd"
let keysUrl = "https://wt.ops.labs.vu.nl/api24/14e65f95";

let beginID;
let pubKey = "";

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

    if (event != undefined) {
        event.preventDefault();
    }

    let box = document.getElementById("chatBox");
    let msgNum = document.getElementById("numMessages").value;
    let response = await fetch(url);
    let content = await response.text();

    json = JSON.parse(content);
    beginID = json[0]["id"];
    console.log(json.length);

    let privKey = document.getElementById("password").value;
    console.log(privKey);
    if (privKey != "") {
        const binaryString = atob(privKey);
        const length = binaryString.length;
        const bytes = new Uint8Array(length);
        for (let i = 0; i < length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }

        privKey = await importKey(bytes.buffer);
    }
    else {
        box.innerHTML = "Please enter a password to view the chat";
        return;
    }

    if (json.length != 0) {
        beginID = json[0]["id"];

        if (msgNum > json.length || msgNum == 0) {
            msgNum = json.length;
        }
        let completeMsg = "";
        for (let i = json.length - msgNum; i < json.length; i++) {
            msg = json[i]["description"]
            console.log(msg);
            binaryString = atob(msg);
            length = binaryString.length;
            bytes = new Uint8Array(length);
            for (let i = 0; i < length; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }
            msg = bytes.buffer;

            let IV = json[i]["year"]
            console.log(IV);
            binaryString = atob(IV);
            length = binaryString.length;
            bytes = new Uint8Array(length);
            for (let i = 0; i < length; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }
            IV = bytes.buffer;
            msg = { IV, msg }
            console.log("1");
            console.log(msg);
            console.log(privKey);
            msg = await decryptMessage(privKey, msg);
            msg = json[i]["name"] + ": " + msg;
            completeMsg += msg + "<br>";
        }
        box.innerHTML = completeMsg;
    }
    window.location.href = '#chatInput';
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
    let object = {};

    let msg = this.value;
    this.value = "";

    let name = document.getElementById("name").value;

    privKey = document.getElementById("password").value;

    if (privKey != "") {
        const binaryString = atob(privKey);
        const length = binaryString.length;
        const bytes = new Uint8Array(length);
        for (let i = 0; i < length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }

        privKey = await importKey(bytes.buffer);
    }
    else {
        box.innerHTML = "Please enter a password to view the chat";
        return;
    }

    msg = await encryptMessage(msg, privKey);
    const { iv, ciphertext } = msg;
    let IV = btoa(String.fromCharCode.apply(null, new Uint8Array(iv)));
    msg = btoa(String.fromCharCode.apply(null, new Uint8Array(ciphertext)));

    object["name"] = name;
    object["year"] = IV;
    object["genre"] = " ";
    object["description"] = msg;
    object["poster"] = " ";
    console.log(msg);

    let json = JSON.stringify(object);

    let response = await fetch(url, {
        method: "POST",
        body: json,
        headers: {
            "Content-Type": "application/json"
        }
    });

    console.log("loadHandler");
    loadHandler();
}

let chat = document.getElementById("chatInput");
chat.addEventListener("keyup", chatHandler);

async function resetHandler(event) {
    event.preventDefault();
    let password = document.getElementById("password").value;
    let hash = await Hash(password);
    console.log(hash);
    if (hash == "f2f1e81615487a3f84addda75489f5f5b3b9d448e6c2abf3af119aa4804dd380") {
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


async function generateKey() {
    return await window.crypto.subtle.generateKey(
        {
            name: "AES-CTR",
            length: 256, // Key length in bits (can be 128, 192, or 256)
        },
        true, // Whether the key is extractable (i.e., can be exported)
        ["encrypt", "decrypt"] // Key usages
    );
}

function generateIV() {
    return window.crypto.getRandomValues(new Uint8Array(16));
}

async function encryptMessage(message, key) {
    const iv = generateIV();
    const encodedMessage = new TextEncoder().encode(message);

    const ciphertext = await window.crypto.subtle.encrypt(
        {
            name: "AES-CTR",
            counter: iv,
            length: 128,
        },
        key,
        encodedMessage
    );

    return {
        iv: iv,
        ciphertext: new Uint8Array(ciphertext),
    };
}

async function decryptMessage(key, encryptedData) {
    const { IV, msg } = encryptedData;

    const decryptedMessage = await window.crypto.subtle.decrypt(
        {
            name: "AES-CTR",
            counter: IV,
            length: 128,
        },
        key,
        msg
    );

    return new TextDecoder().decode(decryptedMessage);
}

async function exportKey(key) {
    const rawKey = await window.crypto.subtle.exportKey("raw", key);
    return new Uint8Array(rawKey);
}

async function importKey(rawKey) {
    return await window.crypto.subtle.importKey(
        "raw",
        rawKey,
        {
            name: "AES-CTR",
            length: rawKey.length * 8, // Key length in bits
        },
        true, // Whether the key is extractable (i.e., can be exported)
        ["encrypt", "decrypt"] // Key usages
    );
}

async function keyGenerator() {
    let key = await generateKey();
    let exportedKey = await exportKey(key);

    const binary = String.fromCharCode.apply(null, new Uint8Array(exportedKey));
    privateBase64String = btoa(binary);

    field = document.getElementById("password");
    field.value = privateBase64String;
    console.log(privateBase64String);
}

beginResetID = 0;
async function resetKeys() {
    await getKeys();
    await fetch(keysUrl + "/reset");
    console.log(beginResetID)
    let promises = [];
    for (let i = beginResetID; i < beginResetID + 9; i++) {
        promises.push(fetch(keysUrl + "/item/" + i, {
            method: "DELETE"
        }));
    }
    await Promise.all(promises);

    console.log("reset");
}

async function getKeys() {
    let response = await fetch(keysUrl);
    let content = await response.text();

    json = JSON.parse(content);

    console.log(json);

    if (json.length != 0) {
        beginResetID = json[0]["id"];

        for (let i = 0; i < json.length; i++) {
            console.log(json[i]);
        }
    }
}