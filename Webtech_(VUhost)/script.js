let url = "https://wt.ops.labs.vu.nl/api24/9a0e18aa" //9a0e18aa

// https://wt.ops.labs.vu.nl/api24/
// https://wt.ops.labs.vu.nl/keys

// https://webtech.labs.vu.nl/api24/  (backup)
// https://webtech.labs.vu.nl/keys

document.addEventListener("DOMContentLoaded", loadHandler)
window.addEventListener("resize", loadHandler);

// code to do with populating the table
async function loadHandler() {
    let table = document.querySelector("table");
    let response = await fetch(url);
    let content = await response.text();

    let json = JSON.parse(content);

    tableModal = document.querySelector("#modal-content");
    rows = document.querySelectorAll("#modal-content tr");
    if (screen.width < 1350 && screen.width > 900) {
        if (rows[0].cells.length != 5) {
            th = rows[0].cells[5];
            rows[0].deleteCell(5);
            let row2 = tableModal.insertRow(1);
            let description = row2.insertCell(0);
            description.style.backgroundColor = "lavender";
            description.outerHTML = '<td colspan="5">' + th.innerHTML + "</td>";
            description.colSpan = 5;
            tableModal.rows[1].style.backgroundColor = "lavender";
            modal = document.querySelector(".modal-content");
            modal.style.width = "95%";
        }
    }
    else {
        if (rows[0].cells.length == 5) {
            th = rows[1].cells[0];
            tableModal.deleteRow(1);
            let description = rows[0].insertCell(5);
            description.outerHTML = '<td>' + th.innerHTML + "</td>";
            modal = document.querySelector(".modal-content");
            modal.style.width = "80%";
        }
    }

    rows = document.querySelectorAll("#tab1 tr");

    for (let j = rows.length - 1; j > 0; j--) {
        if (rows[0].cells.length == 5) {
            if (j >= 2) {
                console.log(j);
                table.deleteRow(j);
            }

        }
        else {
            if (j >= 1) {
                console.log(j);
                table.deleteRow(j);
            }
        }
    }

    select2 = document.getElementById("selectYear2");
    for (let j = rows.length - 1; j > 0; j--) {
        select2.remove(j);
    }

    let years = [];

    if (screen.width < 1100) {
        if (rows[0].cells.length != 5) {
            th = rows[0].cells[5];
            rows[0].deleteCell(5);
            let row2 = table.insertRow(1);
            let description = row2.insertCell(0);
            description.outerHTML = '<th colspan="5">' + th.innerHTML + "</th>";
            description.colSpan = 5;
        }
    }
    else {
        if (rows[0].cells.length == 5) {
            th = rows[1].cells[0];
            table.deleteRow(1);
            let description = rows[0].insertCell(5);
            description.outerHTML = '<th>' + th.innerHTML + "</th>";
        }
    }

    for (let i = 0; i < json.length; i++) {
        let row = table.insertRow(-1);

        let poster = row.insertCell(0);
        let name = row.insertCell(1);
        let year = row.insertCell(2);
        let genre = row.insertCell(3);
        let id = row.insertCell(4);
        if (screen.width < 1100) {
            let row2 = table.insertRow(-1);
            var description = row2.insertCell(0);
            description.colSpan = 5;
        }
        else {
            var description = row.insertCell(5);
        }

        poster.innerHTML = "<img src=\"" + json[i].poster + "\"alt=\"" + json[i].name + "\"><figcaption>Videogame: " + json[i].name + "</figcaption>";
        name.innerHTML = json[i].name;
        year.innerHTML = json[i].year;
        if (!years.includes(json[i].year)) {
            years.push(json[i].year);
        }
        genre.innerHTML = json[i].genre;
        description.innerHTML = json[i].description;
        id.innerHTML = json[i].id;
    }

    years = years.sort();
    for (let j = 0; j < years.length; j++) {
        var opt = document.createElement('option');
        opt.value = years[j];
        opt.innerHTML = years[j];
        select2.appendChild(opt);
    }

    filterHandler();
}

// code to do with the form, validation of the form and reseting the data
let form = document.querySelector("form");
form.addEventListener("submit", formHandler);

async function formHandler(e) {
    let object = {};
    let table = document.querySelector("table");
    formData = new FormData(form);
    formData.forEach(function (value, key) {
        object[key] = value;
    });
    let json = JSON.stringify(object, ["name", "year", "genre", "description", "poster"]);

    e.preventDefault();
    console.log(formData.get("id"));

    if (table.rows[1].cells.length > 1) {
        rowHeight = 1;
    }
    else {
        rowHeight = 2;
    }

    error = false;
    let message = "ERROR:\n";

    idInTable = false;
    for (let i = 0, row; row = table.rows[i]; i += rowHeight) {
        if (row.cells[4].innerHTML == formData.get("id")) {
            idInTable = true;
        }
    }
    if (!idInTable && formData.get("id") != "") {
        message += "submitted ID '" + formData.get("id") + "' not found\n";
        error = true;
    }

    await checkImage(formData.get("poster")).catch(function () {
        message += "Image not found at submitted URL";
        error = true;
    });

    if (error) {
        alert(message);
    }
    else {
        if (formData.get("id") == "") {
            response = await fetch(url, {
                method: "POST",
                body: json,
                headers: {
                    "Content-Type": "application/json"
                }
            });
        }
        else {
            response = await fetch(url + "/item/" + formData.get("id"), {
                method: "PUT",
                body: json,
                headers: {
                    "Content-Type": "application/json"
                }
            });
        }

        let result = await response.text();
        if (response.status == 204) {
            alert("Updated!");
        }
        else if (response.status == 201) {
            alert("Created!");
        }
        else {
            alert(response.status + ": Something went wrong");
        }

        if (response.status == 201 || response.status == 204) {
            loadHandler();
        }
    }
};

function checkImage(url) {

    return new Promise(function (resolve, reject) {
        var img = new Image();
        img.src = url;
        img.onload = resolve;
        img.onerror = reject;
    })
}

let id = document.getElementById("id2");
id.addEventListener("input", idHandler);

async function idHandler() {
    let table = document.querySelector("table");
    for (let i = 0, row; row = table.rows[i]; i++) {
        try {
            if (row.cells[4].innerHTML == id.value) {
                document.getElementById("poster2").value = row.cells[0].children[0].src;
                document.getElementById("name2").value = row.cells[1].innerHTML;
                document.getElementById("year2").value = row.cells[2].innerHTML;
                document.getElementById("genre2").value = row.cells[3].innerHTML;
                document.getElementById("description2").value = row.cells[5].innerHTML;
            }
        }
        catch (err) {
            console.log(err);
        }
    }
}

const button = document.getElementById("reset");
button.addEventListener("click", resetData);

async function resetData() {
    let message = prompt("To reset please input 'RESET'");
    if (message == "RESET") {
        alert("Resetting data")
        await fetch(url + "/reset");
        await loadHandler();
    }
}

// code to do with filtering and searching
async function filterHandler() {
    selectHandler();
    searchHandler();
}

let selected = document.getElementById("selectYear2");
selected.addEventListener("change", filterHandler);

async function selectHandler() {
    let table = document.querySelector("#tab1");

    let value = selected.options[selected.selectedIndex].value;

    if (screen.width < 1100) {
        rowHeight = 2;
    }
    else {
        rowHeight = 1;
    }

    if (value == "noFilter") {
        for (let i = rowHeight, row; row = table.rows[i]; i += rowHeight) {
            row.style.display = "";
            if (rowHeight == 2) {
                table.rows[i + 1].style.display = "";
            }

        }
    }
    else {
        for (let i = rowHeight, row; row = table.rows[i]; i += rowHeight) {
            if (row.cells[2].innerHTML == value) {
                row.style.display = "";
                if (rowHeight == 2) {
                    table.rows[i + 1].style.display = "";
                }

            }
            else {
                row.style.display = "none";
                if (rowHeight == 2) {
                    table.rows[i + 1].style.display = "none";
                }
            }
        }
    }
}

let search = document.getElementById("search");
search.addEventListener("input", filterHandler);

async function searchHandler() {
    let table = document.querySelector("table");
    let value = search.value.toLowerCase();
    let displayNum = 1;

    if (screen.width < 1100) {
        rowHeight = 2;
    }
    else {
        rowHeight = 1;
    }

    for (let i = rowHeight, row; row = table.rows[i]; i += rowHeight) {
        if (!row.cells[1].innerHTML.toLowerCase().includes(value) && !row.cells[3].innerHTML.toLowerCase().includes(value)) {
            row.style.display = "none";
            if (rowHeight == 2) {
                table.rows[i + 1].style.display = "none";
            }
        }
        else if (row.style.display != "none") {
            displayNum++;
            if (displayNum % 2 == 0) {
                row.style.backgroundColor = "white";
            }
            else {
                row.style.backgroundColor = "lavender";
            }

            if (rowHeight == 2) {

                if (displayNum % 2 == 0) {
                    table.rows[i + 1].style.backgroundColor = "white";
                }
                else {
                    table.rows[i + 1].style.backgroundColor = "lavender";
                }
            }
        }

    }
}

// code to do with printing
addEventListener("beforeprint", printHandler);
async function printHandler() {
    let table = document.querySelector("table");
    let response = await fetch(url);
    let content = await response.text();

    let json = JSON.parse(content);


    rows = document.querySelectorAll("#tab1 tr");
    for (let j = rows.length - 1; j > 0; j--) {
        if (rows[0].cells.length == 5) {
            if (j >= 2) {
                console.log(j);
                table.deleteRow(j);
            }

        }
        else {
            if (j >= 1) {
                console.log(j);
                table.deleteRow(j);
            }
        }
    }


    if (rows[0].cells.length != 5) {
        th = rows[0].cells[5];
        rows[0].deleteCell(5);
        let row2 = table.insertRow(1);
        let description = row2.insertCell(0);
        description.outerHTML = '<th colspan="5">' + th.innerHTML + "</th>";
        description.colSpan = 5;
    }

    for (let i = 0; i < json.length; i++) {
        let row = table.insertRow(-1);

        let poster = row.insertCell(0);
        let name = row.insertCell(1);
        let year = row.insertCell(2);
        let genre = row.insertCell(3);
        let id = row.insertCell(4);

        let row2 = table.insertRow(-1);
        var description = row2.insertCell(0);
        description.colSpan = 5;



        poster.innerHTML = "<img src=\"" + json[i].poster + "\"alt=\"" + json[i].name + "\"><figcaption>Videogame: " + json[i].name + "</figcaption>";
        name.innerHTML = json[i].name;
        year.innerHTML = json[i].year;
        genre.innerHTML = json[i].genre;
        description.innerHTML = json[i].description;
        id.innerHTML = json[i].id;
    }
    return true;
}

addEventListener("afterprint", afterPrintHandler);
async function afterPrintHandler() {
    loadHandler();
}

// code to do with the modal (gotten from w3schools (https://www.w3schools.com/howto/howto_css_modals.asp) and modified to only use javascript in this file)
openModal = document.getElementById("showModal");
openModal.addEventListener("click", openModalHandler);

async function openModalHandler() {
    let modal = document.getElementById("modal");
    modal.style.display = "block";
}

closeModal = document.getElementById("close");
closeModal.addEventListener("click", closeModalHandler);
async function closeModalHandler() {
    let modal = document.getElementById("modal");
    modal.style.display = "none";
}

window.addEventListener("click", windowHandler);
async function windowHandler(event) {
    let modal = document.getElementById("modal");
    let isClickInside = modal.contains(event.target);

    if (event.target == modal) {
        modal.style.display = "none";
    }
}