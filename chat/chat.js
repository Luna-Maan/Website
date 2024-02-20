// resetting chat and getting a new key
// 1. reset chat through the reset button
// 2. reset the key database through the function 'resetKeys()'
// 3. get a new key through the function 'uploadKey()'


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

    let privKey = document.getElementById("password").value;
    console.log(privKey);
    if (privKey != "") {
        console.log("hallo");
        console.log(privKey);
        jsonBytes = new Uint8Array(atob(privKey).split('').map(c => c.charCodeAt(0)));
        jsonString = new TextDecoder().decode(jsonBytes);
        privKey = JSON.parse(jsonString);
        privKey = await importKey(privKey, "private");
        console.log(privKey);
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

async function chatHandler(event) {
    if (event.key != "Enter") {
        return;
    }
    let object = {};

    let msg = this.value;
    this.value = "";

    let name = document.getElementById("name").value;

    if (pubKey == "") {
        await getKey();
    }

    msg = await encryptMessage(pubKey, msg);
    msg = btoa(String.fromCharCode.apply(null, new Uint8Array(msg)));

    object["name"] = name;
    object["year"] = msg;
    object["genre"] = msg;
    object["description"] = msg;
    object["poster"] = msg;

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

// Generate RSA key pair
async function generateRSAKeyPair() {
    try {
        const keyPair = await window.crypto.subtle.generateKey(
            {
                name: "RSA-OAEP",
                modulusLength: 2048,
                publicExponent: new Uint8Array([0x01, 0x00, 0x01]), // 65537
                hash: "SHA-256"
            },
            true, // extractable
            ["encrypt", "decrypt"] // key usages
        );

        return keyPair;
    } catch (error) {
        console.error("Error generating RSA key pair:", error);
        return null;
    }
}

// Encrypt a message using the provided RSA public key
async function encryptMessage(publicKey, message) {
    try {
        const encryptedBuffer = await window.crypto.subtle.encrypt(
            {
                name: "RSA-OAEP"
            },
            publicKey,
            new TextEncoder().encode(message)
        );

        const encryptedMessage = new Uint8Array(encryptedBuffer);
        return encryptedMessage;
    } catch (error) {
        console.error("Error encrypting message:", error);
        return null;
    }
}

// Decrypt an encrypted message using the provided RSA private key
async function decryptMessage(privateKey, encryptedMessage) {
    try {
        const decryptedBuffer = await window.crypto.subtle.decrypt(
            {
                name: "RSA-OAEP"
            },
            privateKey,
            encryptedMessage
        );

        const decryptedMessage = new TextDecoder().decode(decryptedBuffer);
        return decryptedMessage;
    } catch (error) {
        console.error("Error decrypting message:", error);
        return null;
    }
}

// Export an RSA key as base64-encoded string
async function exportKey(key) {
    try {
        const exportedKey = await window.crypto.subtle.exportKey(
            "jwk",
            key
        );

        return JSON.stringify(exportedKey);
    } catch (error) {
        console.error("Error exporting key:", error);
        return null;
    }
}

// Import an RSA key from base64-encoded string
async function importKey(keyData, keyType) {
    try {
        const importedKey = await window.crypto.subtle.importKey(
            "jwk",
            JSON.parse(keyData),
            {
                name: "RSA-OAEP",
                hash: "SHA-256"
            },
            true, // extractable
            keyType === "public" ? ["encrypt"] : ["decrypt"]
        );

        return importedKey;
    } catch (error) {
        console.error("Error importing key:", error);
        return null;
    }
}

async function uploadKey() {
    const keyPair = await generateRSAKeyPair();
    if (!keyPair) return;

    const { publicKey, privateKey } = keyPair;

    let exportedPublicKey = await exportKey(publicKey);
    let exportedPrivateKey = await exportKey(privateKey);

    let privateString = JSON.stringify(exportedPrivateKey);
    let privateBytes = new TextEncoder().encode(privateString);
    let privateBase64String = btoa(String.fromCharCode.apply(null, privateBytes));

    let jsonString = JSON.stringify(exportedPublicKey);
    let jsonBytes = new TextEncoder().encode(jsonString);
    let base64String = btoa(String.fromCharCode.apply(null, jsonBytes));

    let object = {};
    object["name"] = base64String;
    object["year"] = " ";
    object["genre"] = " ";
    object["description"] = " ";
    object["poster"] = " ";

    json = JSON.stringify(object);
    let response = await fetch(keysUrl, {
        method: "POST",
        body: json,
        headers: {
            "Content-Type": "application/json"
        }
    });

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

async function getKey() {
    let response = await fetch(keysUrl);
    let content = await response.text();

    json = JSON.parse(content);

    base64String = json[0]["name"];
    jsonBytes = new Uint8Array(atob(base64String).split('').map(c => c.charCodeAt(0)));
    jsonString = new TextDecoder().decode(jsonBytes);
    pubKey = JSON.parse(jsonString);
    pubKey = await importKey(pubKey, "public");
    console.log(pubKey);
}