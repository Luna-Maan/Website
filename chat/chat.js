console.log("Chat.js");
let url = "https://wt.ops.labs.vu.nl/api24/9fd5e7bd"

async function formHandler(event) {
    event.preventDefault();
    let box = document.getElementById("chatBox");
    let object = {};

    let formData = new FormData(form);
    let message = formData.get("chatInput");

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

    console.log(response);

    response = await fetch(url);
    let content = await response.text();

    json = JSON.parse(content);

    console.log(json);

    box.innerHTML = "";
    for (let i = 0; i < json.length; i++) {
        message = json[i]["name"] + ": " + json[i]["description"]
        box.innerHTML += message + "<br>";
    }
    /*
    event.preventDefault();
    let message = document.querySelector("input").value;
    let response = await fetch("/chat", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ message })
    });
    let data = await response.json();
    console.log(data);
    let chat = document.querySelector("#chat");
    let newMessage = document.createElement("p");
    newMessage.textContent = data.message;
    chat.appendChild(newMessage);
    document.querySelector("input").value = "";
    */
}

let form = document.querySelector("form");
form.addEventListener("submit", formHandler);