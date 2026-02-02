import { Data } from './data.js';
import { TrackerUI } from './tracker-ui.js';
import { stats } from './stats.js';

Data.init();

let radii = generateRadii(Data.categories.length);
console.log("Radii for categories:", radii);
function generateRadii(numCategories) {
    const radii = [];
    let radius = 8;
    for (let i = 0; i < numCategories; i++) {
        radii.unshift(radius);
        radius += 16;
    }
    return radii;
}

// Edit button
document.getElementById("edit-categories-btn").addEventListener("click", () => {
    const combined = Data.categories.map((cat, i) => `${cat}_${Data.colors[i]}`).join(", ");
    const newInput = prompt(
        "Edit categories and colors (format: Category_Color, ...)\nExample: Shower_#ff0000",
        combined
    );
    if (newInput) {
        const newPairs = newInput.split(",").map(pair => pair.trim());
        const newCategories = [];
        const newColors = [];

        newPairs.forEach(pair => {
            const [cat, col] = pair.split("_").map(s => s.trim());
            if (cat) {
                newCategories.push(cat);
                newColors.push(col || "#" + Math.floor(Math.random() * 16777215).toString(16));
            }
        });

        if (newCategories.length > 0) {
            Data.updateMetaData(newCategories, newColors);
            location.reload();
        }
    }
});

function handleLevelChange(monthStr, dayNr, ringIndex, goal, updateInput = true) {
    const inputField = document.querySelector(`.level-input[data-index='${ringIndex}']`);
    let level;

    if (updateInput) {
        level = (parseInt(goal.getAttribute('data-level'), 10) + 1) % 3;
    } else {
        level = parseInt(inputField.value, 10);
    }

    // Update the element that was actually clicked (Today OR Grid)
    goal.setAttribute('data-level', level);
    const path = goal.querySelector(".fill");
    const radius = parseFloat(goal.querySelector(".bg").getAttribute('r'));
    TrackerUI.updateArc(path, level, radius, radii);

    // Sync the Today View input box
    if (inputField) {
        inputField.value = level;
    }

    // Sync the Month Grid (this handles updating the small trackers)
    TrackerUI.updateMonthRing(dayNr, ringIndex, level, radii);

    // Persist data
    Data.setDayLevel(monthStr, dayNr - 1, ringIndex, level);

    const daysInMonth = new Date(...monthStr.split("-").map(Number), 0).getDate();
    stats.displayStreaks(monthStr, dayNr);
    stats.displaySummary(monthStr, daysInMonth, radii);
}

async function initTracker() {
    const grid = document.getElementById("tracker-grid");
    const monthInput = document.getElementById("month-selector");
    const dayInput = document.getElementById("day-selector");

    const monthTitle = document.getElementById("selected-month-title");
    const dayTitle = document.getElementById("selected-day-title");

    // Default to today
    let today = new Date();
    const defaultMonthStr = today.toISOString().slice(0, 7); // "2025-06"
    const defaultDay = today.getDate();

    monthInput.value = defaultMonthStr;
    dayInput.value = defaultDay;

    createInputPanel();

    async function render(monthStr, focusDay) {

        const [y, m] = monthStr.split("-").map(Number);
        const date = new Date(y, m - 1, focusDay);

        // Format day view: DD/MM/YYYY
        const dd = String(date.getDate()).padStart(2, '0');
        const mm = String(date.getMonth() + 1).padStart(2, '0'); // months are 0-indexed
        const yyyy = date.getFullYear();

        dayTitle.textContent = `Day View: ${dd}/${mm}/${yyyy}`;

        // Format month view: FullMonthName YYYY
        const monthName = date.toLocaleString('default', { month: 'long' });
        monthTitle.textContent = `Month View: ${monthName} ${yyyy}`;


        // Clear containers
        grid.innerHTML = "";

        const [year, month] = monthStr.split("-").map(Number);
        const daysInMonth = new Date(year, month, 0).getDate(); // month is 1-indexed here

        // Adjust focusDay if out of bounds
        if (focusDay < 1) focusDay = 1;
        if (focusDay > daysInMonth) focusDay = daysInMonth;
        dayInput.max = daysInMonth;

        let data = await Data.getMonthData(monthStr);

        // --- Focus Day Section ---
        const todayLevels = data[focusDay - 1];
        const todayWrapper = document.getElementById("today-wrapper");
        todayWrapper.innerHTML = "";
        const todayTracker = TrackerUI.createDayTracker(focusDay, todayLevels, "today", radii);
        todayWrapper.appendChild(todayTracker);

        // Input panel
        const goalGroups = todayTracker.querySelectorAll(".goal");
        const inputs = document.querySelectorAll(".level-input");
        inputs.forEach((input, i) => {
            input.value = todayLevels[i] ?? 0;
            // Update the 'change' logic to use current render context
            input.onchange = () => {
                const goalGroup = todayTracker.querySelector(`.goal[data-index='${i}']`);
                handleLevelChange(monthStr, focusDay, i, goalGroup, false);
            };
        });

        // --- Notes Section ---
        createNoteSection(monthStr, focusDay);

        // --- Grid of the Month ---
        for (let day = 1; day <= daysInMonth; day++) {
            const levels = data[day - 1];
            console.log(`Creating tracker for day ${day} with levels`, levels);
            const tracker = TrackerUI.createDayTracker(day, levels, "day", radii);
            grid.appendChild(tracker);
        }

        // Clickable tracking
        // Clickable tracking for today view
        todayTracker.querySelectorAll('.goal').forEach((goal, i) => {
            goal.addEventListener('click', () => {
                handleLevelChange(monthStr, focusDay, i, goal);
            });
        });

        // Clickable tracking for month grid
        grid.querySelectorAll('.goal').forEach((goal) => {
            const index = parseInt(goal.dataset.index, 10);
            const dayNr = parseInt(goal.closest('.day-wrapper').dataset.dayNr, 10);

            goal.addEventListener('click', (e) => {
                e.stopPropagation();
                handleLevelChange(monthStr, dayNr, index, goal);
            });
        });

        stats.displayStreaks(monthStr, focusDay);
        stats.displaySummary(monthStr, daysInMonth, radii);
    }

    // Attach change listeners
    monthInput.addEventListener('change', () => {
        render(monthInput.value, parseInt(dayInput.value, 10));
    });
    dayInput.addEventListener('change', () => {
        render(monthInput.value, parseInt(dayInput.value, 10));
    });

    // Initial render
    render(defaultMonthStr, defaultDay);
}

window.addEventListener('DOMContentLoaded', initTracker);

function createInputPanel() {
    const container = document.getElementById("input-panel-container"); // Add this ID to your HTML
    container.innerHTML = "<strong>Set fill levels (0–2):</strong>";

    Data.categories.forEach((label, i) => {
        const row = document.createElement("div");
        row.className = "input-row";

        const span = document.createElement("span");
        span.textContent = `${label}: `;
        span.style.color = Data.colors[i];

        const input = document.createElement("input");
        input.className = "level-input";
        input.type = "number";
        input.min = "0";
        input.max = "2";
        input.dataset.index = i; // Crucial for identification

        row.append(span, input);
        container.appendChild(row);
    });
}

function createNoteSection(monthStr, focusDay) {
    const notesKey = `${monthStr}-${focusDay}`;

    const notesInput = document.getElementById("daily-notes");
    notesInput.value = Data.notes[notesKey] || "";
    notesInput.placeholder = "Add your notes for the day here...";
    notesInput.replaceWith(notesInput.cloneNode(true));

    const newNotesInput = document.getElementById("daily-notes");
    newNotesInput.addEventListener("input", () => {
        Data.setNote(notesKey, newNotesInput.value);
    });
}

//MARK: Export/Import
document.getElementById('export-btn').addEventListener('click', () => {
    const allData = Data.getState();
    const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `tracker-backup-v${Data.version}.json`;
    a.click();

    URL.revokeObjectURL(url);
});
document.getElementById('import-btn').addEventListener('click', () => {
    document.getElementById('import-file').click();
});
document.getElementById('import-file').addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
        const text = await file.text();
        const importedData = JSON.parse(text);
        localStorage.setItem('trackerData', JSON.stringify(importedData));
        location.reload();
    } catch (e) {
        alert("Invalid file or corrupted data.");
    }
});

//MARK: Cloud
document.getElementById('cloud-save-btn').addEventListener('click', async () => {
    const username = prompt("Enter your username:");
    const password = prompt("Enter your password:");

    if (!username || !password) {
        alert("Username and password are required. \nRegister at the bottom of the day view.");
        return;
    }

    try {
        const response = await fetch('https://tutorial-worker.pvanoostveenneo2.workers.dev/tracker', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username,
                password,
                data: Data.getState()
            })
        });

        const text = await response.text();

        if (response.ok) {
            alert("Successfully saved to the cloud!");
        } else {
            alert("Server error: " + text);
        }

    } catch (err) {
        alert("Failed to save data: " + err.message);
    }
});

document.getElementById('cloud-load-btn').addEventListener('click', async () => {
    const username = prompt("Enter your username:");
    const password = prompt("Enter your password:");

    if (!username || !password) {
        alert("Username and password are required. \nRegister at the bottom of the day view.");
        return;
    }

    try {
        const url = `https://tutorial-worker.pvanoostveenneo2.workers.dev/tracker?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`;

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            const text = await response.text();
            alert("Failed to load data from cloud: " + text);
            return;
        }

        const json = await response.json();

        if (!json.data) {
            alert("No data found for this user.");
            return;
        }

        localStorage.setItem('trackerData', JSON.stringify(json.data));

        alert("Successfully loaded data from the cloud!");

        location.reload();

    } catch (err) {
        alert("Error loading data: " + err.message);
    }
});

document.getElementById('register-btn').addEventListener('click', async () => {
    const name = prompt("Enter a new username:");
    const personalPassword = prompt("Enter a new password:");

    if (!name || !personalPassword) {
        alert("Username and password are required.");
        return;
    }

    try {
        const response = await fetch('https://tutorial-worker.pvanoostveenneo2.workers.dev/register/', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name, personalPassword })
        });

        const text = await response.text();

        if (response.ok) {
            alert("Registration successful!");
        } else {
            alert("Registration failed: " + text);
        }

    } catch (err) {
        alert("Error during registration: " + err.message);
    }
});

