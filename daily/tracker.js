import { Data } from './data.js';
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


function getArcPath(x, y, r, startAngle, endAngle) {
    const rad = (angle) => (angle - 90) * Math.PI / 180.0;
    const p1 = { x: x + r * Math.cos(rad(startAngle)), y: y + r * Math.sin(rad(startAngle)) };
    const p2 = { x: x + r * Math.cos(rad(endAngle)), y: y + r * Math.sin(rad(endAngle)) };

    const diff = Math.abs(endAngle - startAngle);
    if (diff >= 360) {
        // Full circle fix: Path cannot start and end at same point
        return `M ${x - r} ${y} a ${r} ${r} 0 1 1 ${r * 2} 0 a ${r} ${r} 0 1 1 ${-r * 2} 0`;
    }

    const largeArc = diff > 180 ? 1 : 0;
    const sweep = endAngle >= startAngle ? 1 : 0;
    return `M ${p1.x} ${p1.y} A ${r} ${r} 0 ${largeArc} ${sweep} ${p2.x} ${p2.y}`;
}

function updateArc(path, level, r) {
    const maxRadius = Math.max(...radii);
    const padding = 10;
    const center = (maxRadius + padding);
    const angle = (level / 2) * 360;

    if (angle === 0) {
        path.setAttribute('d', '');
    } else {
        // Always start from the top (0°) and go to the calculated angle
        path.setAttribute('d', getArcPath(center, center, r, 0, angle));
    }
}

const createElNS = (tag, attrs = {}) => {
    const svgNS = "http://www.w3.org/2000/svg";
    const el = document.createElementNS(svgNS, tag);
    Object.entries(attrs).forEach(([k, v]) => {
        if (v == null) return;
        el.setAttribute(k, String(v));
    });
    return el;
};

/**
 * 
 * @param {*} day 
 * @param {*} levels 
 * @param {*} type 'today' or 'summary' or 'day'
 * @returns 
 */
function createDayTracker(dayNr, levels, type) {
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    if (type === "today") {
        svg.setAttribute("class", "today-tracker");
    } else if (type === "summary") {
        svg.setAttribute("class", "summary-tracker");
    } else {
        svg.setAttribute("class", "tracker");
    }

    const maxRadius = Math.max(...radii);
    const padding = 10;
    const width = (maxRadius + padding) * 2;
    const center = (maxRadius + padding);

    svg.setAttribute("viewBox", `0 0 ${width} ${width}`);

    for (let i = 0; i < Data.categories.length; i++) {
        const group = createElNS("g");
        group.classList.add("goal");
        group.dataset.index = i;
        group.dataset.dayNr = dayNr;
        group.dataset.level = levels[i] ?? 0;
        group.dataset.radius = radii[i];

        const circle = createElNS("circle", {
            class: "bg",
            cx: center,
            cy: center,
            r: radii[i],
            fill: "none",
            stroke: "#d6d6d6ff",
            "stroke-width": "16"
        });

        const path = createElNS("path", {
            class: "fill",
            stroke: Data.colors[i],
            "stroke-width": "16",
            fill: "none"
        });
        path.dataset.index = i;
        path.dataset.dayNr = dayNr;

        updateArc(path, levels[i] ?? 0, radii[i]);

        group.appendChild(circle);
        group.appendChild(path);
        svg.appendChild(group);
    }

    const wrapper = document.createElement("div");
    wrapper.className = "day-wrapper";
    wrapper.style.display = "inline-block";
    wrapper.style.margin = "2px";
    wrapper.style.textAlign = "center";
    wrapper.dataset.dayNr = dayNr;

    const label = document.createElement("div");
    if (type === "day") {
        label.textContent = dayNr;
    }

    label.style.marginBottom = "4px";

    wrapper.appendChild(label);
    wrapper.appendChild(svg);
    return wrapper;
}

function createSummaryTracker(label, averageLevels) {
    const tracker = createDayTracker(label, averageLevels.map(p => -p * 2), "summary");

    const container = document.createElement("div");
    container.style.display = "inline-block";
    container.style.margin = "0 10px";
    container.style.textAlign = "center";
    container.appendChild(tracker);

    return container;
}

function updateMonthRing(dayNr, ringIndex, level) {
    const grid = document.getElementById("tracker-grid");
    const gridDay = grid.querySelector(`.day-wrapper[data-day-nr='${dayNr}']`);
    gridDay.setAttribute('data-level', level);
    const radius = parseFloat(gridDay.querySelector(`.goal[data-index='${ringIndex}'] .bg`).getAttribute('r'));
    updateArc(gridDay.querySelector('.fill'), level, radius);
}

function handleLevelChange(monthStr, dayNr, ringIndex, goal, updateInput = true) {
    let level = parseInt(goal.getAttribute('data-level'), 10);
    if (updateInput) {
        level = (level + 1) % 3;
    }

    goal.setAttribute('data-level', level);
    const path = goal.querySelector(".fill");
    const radius = parseFloat(goal.querySelector(".bg").getAttribute('r'));

    updateArc(path, level, radius);
    updateMonthRing(dayNr, ringIndex, level);

    const inputField = document.querySelector(`.level-input[data-index='${ringIndex}']`);
    if (inputField) {
        inputField.value = level;
    }

    Data.setDayLevel(monthStr, dayNr - 1, ringIndex, level);

    const daysInMonth = new Date(...monthStr.split("-").map(Number), 0).getDate();
    displayStreaks(monthStr, dayNr);
    displaySummary(monthStr, daysInMonth);
}

async function initTracker() {
    const grid = document.getElementById("tracker-grid");
    const todayContainer = document.getElementById("today-tracker");
    const monthInput = document.getElementById("month-selector");
    const dayInput = document.getElementById("day-selector");

    // Default to today
    let today = new Date();
    const defaultMonthStr = today.toISOString().slice(0, 7); // "2025-06"
    const defaultDay = today.getDate();

    monthInput.value = defaultMonthStr;
    dayInput.value = defaultDay;

    async function render(monthStr, focusDay) {
        // Update titles
        const monthTitle = document.getElementById("selected-month-title");
        const dayTitle = document.getElementById("selected-day-title");

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
        todayContainer.innerHTML = "";

        const [year, month] = monthStr.split("-").map(Number);
        const daysInMonth = new Date(year, month, 0).getDate(); // month is 1-indexed here

        // Adjust focusDay if out of bounds
        if (focusDay < 1) focusDay = 1;
        if (focusDay > daysInMonth) focusDay = daysInMonth;
        dayInput.max = daysInMonth;

        let data = await Data.getMonthData(monthStr);

        // --- Focus Day Section ---
        const todayLevels = data[focusDay - 1];
        const todayWrapper = document.createElement('div');
        todayWrapper.className = "today-wrapper";

        const todayTracker = createDayTracker(focusDay, todayLevels, "today");
        todayWrapper.appendChild(todayTracker);

        // Input panel
        const goalGroups = todayTracker.querySelectorAll(".goal");
        const inputPanel = createInputPanel(year, monthStr, focusDay, todayLevels, goalGroups);
        todayWrapper.appendChild(inputPanel);

        // --- Notes Section ---
        createNoteSection(monthStr, focusDay);

        todayContainer.appendChild(todayWrapper);

        // --- Grid of the Month ---
        for (let day = 1; day <= daysInMonth; day++) {
            const levels = data[day - 1];
            console.log(`Creating tracker for day ${day} with levels`, levels);
            const tracker = createDayTracker(day, levels, "day");
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
        grid.querySelectorAll('.goal').forEach((goal, i) => {
            const index = goal.dataset.index;
            const dayNr = goal.parentElement.parentElement.dataset.dayNr;

            goal.addEventListener('click', () => {
                handleLevelChange(monthStr, dayNr, index, goalGroups[index]);
            });
        });

        displayStreaks(monthStr, focusDay);
        displaySummary(monthStr, daysInMonth);
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

function createInputPanel(year, monthStr, focusDay, todayLevels, goalGroups) {
    const inputPanel = document.createElement('div');
    inputPanel.innerHTML = "<strong>Set fill levels (0–2):</strong><br>";

    Data.categories.forEach((label, i) => {
        const row = document.createElement("div");
        row.style.display = "flex";
        row.style.alignItems = "center";
        row.style.marginBottom = "4px";
        row.style.gap = "8px";

        const span = document.createElement("span");
        span.textContent = `${label}: `;
        span.style.color = Data.colors[i];

        const input = document.createElement("input");
        input.className = "level-input";
        input.dataset.index = i;
        input.type = "number";
        input.min = "0";
        input.max = "2";
        input.value = todayLevels[i];
        input.style.width = "4em";
        input.style.marginLeft = "auto";

        input.addEventListener("change", () => {
            let val = Math.max(0, Math.min(2, parseInt(input.value, 10) || 0));
            const group = goalGroups[i];
            group.dataset.level = val;

            console.log(`Input change: Setting level for ${monthStr}, day ${focusDay}, category ${i} to ${val}`);
            handleLevelChange(monthStr, focusDay, i, group, false);
        });

        row.appendChild(span);
        row.appendChild(input);
        inputPanel.appendChild(row);
    });
    return inputPanel;
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

async function displayStreaks(monthStr, focusDay) {
    const [year, month] = monthStr.split("-").map(Number);
    const streaksContainer = document.getElementById("streak-counters");
    streaksContainer.innerHTML = "";

    // Initialize streaks per category
    let streaks = Array(Data.categories.length).fill(0);
    let streakBroken = Array(Data.categories.length).fill(false);

    // Parse selected date
    const currentDate = new Date(year, month - 1, focusDay);

    // Go backwards in time day by day
    while (streakBroken.some(broken => !broken)) {
        const key = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
        const monthData = Data.months[key];
        if (!monthData) break;

        const dayIndex = currentDate.getDate() - 1;
        const levels = monthData[dayIndex] ?? Array(Data.categories.length).fill(0);

        for (let i = 0; i < levels.length; i++) {
            if (streakBroken[i]) continue;
            const level = levels[i] ?? 0;
            if (level >= 1) {
                streaks[i]++;
            } else {
                streakBroken[i] = true;
            }
        }

        // Go back one day
        currentDate.setDate(currentDate.getDate() - 1);
    }

    // Display streaks
    for (let i = 0; i < Data.categories.length; i++) {
        const streak = streaks[i];

        // Choose emoji based on streak length
        let emoji = "";
        if (streak >= 20) {
            const times = Math.floor((streak - 10) / 10);
            emoji = "🔥".repeat(times);
        } else if (streak >= 15) {
            emoji = "🏅";
        } else if (streak >= 10) {
            emoji = "💪";
        } else if (streak >= 5) {
            emoji = "✨";
        }

        const line = document.createElement("div");
        line.textContent = `${emoji ? emoji + " " : ""}${Data.categories[i]}: ${streak} day${streak === 1 ? '' : 's'}`;
        line.style.color = Data.colors[i];
        line.style.marginBottom = "4px";
        streaksContainer.appendChild(line);
    }
}

function displaySummary(monthStr, daysInMonth) {
    const [year, month] = monthStr.split("-").map(Number);
    const summaryMonthContainer = document.getElementById("month-summary");
    const summaryYearContainer = document.getElementById("year-summary");


    summaryMonthContainer.innerHTML = "";
    summaryYearContainer.innerHTML = "";
    // MARK: Summaries
    // Summary for the selected month
    const today = new Date();
    const isCurrentMonth = today.getFullYear() === year && today.getMonth() + 1 === month;
    const dayCutoff = isCurrentMonth ? today.getDate() : daysInMonth;
    const monthData = Data.months[monthStr];
    const monthAverages = computeAverages(monthData || [], dayCutoff);
    summaryMonthContainer.appendChild(createSummaryTracker("Month", monthAverages));

    // Summary for the selected year
    let yearTotal = Array(Data.categories.length).fill(0);
    let yearDays = 0;

    for (let mo = 1; mo <= 12; mo++) {
        const key = `${year}-${String(mo).padStart(2, '0')}`;
        const monthData = Data.months[key];
        if (!monthData) continue;

        const maxDay = (year === today.getFullYear() && mo === today.getMonth() + 1) ? today.getDate() : monthData.length;
        for (let i = 0; i < maxDay; i++) {
            for (let j = 0; j < Data.categories.length; j++) {
                yearTotal[j] += monthData[i]?.[j] ?? 0;
            }
        }
        yearDays += maxDay;
    }

    const yearAverages = yearTotal.map(sum => (sum / (yearDays || 1)) / 2);
    summaryYearContainer.appendChild(createSummaryTracker("Year", yearAverages));
}

function computeAverages(data, dayLimit) {
    const total = Array(Data.categories.length).fill(0);
    for (let i = 0; i < dayLimit && i < data.length; i++) {
        for (let j = 0; j < Data.categories.length; j++) {
            total[j] += data[i]?.[j] ?? 0;
        }
    }
    return total.map(sum => (sum / (dayLimit || 1)) / 2);  // Normalize: level 2 = 100%
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

