function loadCategories() {
    const allData = localStorage.getItem("trackerData");
    if (allData) {
        try {
            const parsedData = JSON.parse(allData);
            return parsedData.categories || [];
        } catch {
            // Fallback to default categories if parsing fails
            return [];
        }
    }
}

// Save categories
function saveCategories(categories) {
    const allData = JSON.parse(localStorage.getItem("trackerData") || '{}');
    allData.categories = categories;
    localStorage.setItem("trackerData", JSON.stringify(allData));
}

let categories = loadCategories();
if (!categories || categories.length === 0) {
    categories = ["Fruit", "Shower", "Exercise (30m/60m)", "Screen Time (2h/1h30)", "Browser Time (1h30/1h)", "sleep (6h30/7h30)", "Bed Time (1:30/0:30)"];
    saveCategories(categories);
}

const labels = categories.map((cat, i) => {
    const parts = cat.split(" ");
    return parts.map((part, j) => {
        if (j === 0) {
            return part.charAt(0).toUpperCase() + part.slice(1);
        }
        return part.toLowerCase();
    }).join(" ");
});
const emptyArray = Array(categories.length).fill(0);
let radii = generateRadii(categories.length);
function generateRadii(numCategories) {
    const radii = [];
    let radius = 8;
    for (let i = 0; i < numCategories; i++) {
        radii.unshift(radius); // add radius to front
        radius += 16;
    }
    return radii;
}

let colors = ["#99ffe9b0", "#fefabcff", "#f9d3b4ff", "#f99ca2ff", "#feb2ebff", "#bfaaff", "#a3c4f3"];

document.getElementById("edit-categories-btn").addEventListener("click", () => {
    const newCategories = prompt("Edit categories (comma-separated) (adding to the end will preserve your save, as will deleting from the end):", categories.join(", "));
    if (newCategories) {
        const newCategoryArray = newCategories.split(",").map(cat => cat.trim());
        if (newCategoryArray.length > 0) {
            categories = newCategoryArray;
            colors = Array.from({ length: categories.length }, () => "#" + Math.floor(Math.random() * 16777215).toString(16));
            saveCategories(categories);
            location.reload(); // Reload to reflect changes
        }
    }
});

// MARK: SVG arcs
function polarToCartesian(cx, cy, r, angle) {
    const rad = (angle - 90) * Math.PI / 180.0;
    return {
        x: cx + r * Math.cos(rad),
        y: cy + r * Math.sin(rad)
    };
}
function describeArc(cx, cy, r, startAngle, endAngle) {
    const start = polarToCartesian(cx, cy, r, startAngle);
    const end = polarToCartesian(cx, cy, r, endAngle);
    const largeArcFlag = (endAngle - startAngle) <= 180 ? "0" : "1";

    // Sweep flag '1' means clockwise
    return [
        "M", start.x, start.y,
        "A", r, r, 0, largeArcFlag, 0, end.x, end.y
    ].join(" ");
}
function updateArc(path, level, r) {
    const maxRadius = Math.max(...radii);
    const padding = 10;
    const width = (maxRadius + padding) * 2;
    const center = (maxRadius + padding);
    const clamped = Math.max(-2, Math.min(2, level));
    const angle = (clamped / 2) * 360;
    if (angle == 0) {
        path.setAttribute('d', '');
    } else if (angle >= 360) {
        // Draw full circle with two arcs
        const cx = center, cy = center;
        const d = `
            M ${cx - r}, ${cy}
            a ${r},${r} 0 1,1 ${2 * r},0
            a ${r},${r} 0 1,1 ${-2 * r},0
        `;
        path.setAttribute('d', d.trim());
    } else if (angle <= -180) {
        const cx = center, cy = center;
        console.log("Negative angle:", angle);
        const endAngle = 720.1 + angle; // positive number ≥ 180
        console.log("End angle:", endAngle);

        const end = polarToCartesian(cx, cy, r, endAngle);

        const secondArcAngleDiff = endAngle - 180;
        const largeArcFlag = secondArcAngleDiff > 180 ? "1" : "0";

        const d = `
        M ${cx}, ${cy + r}
        a ${r},${r} 0 1,1 0,${-2 * r}
        A ${r},${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y}
    `;
        path.setAttribute('d', d.trim());
    }
    else {
        // Arc from top (0 deg) clockwise to angle
        path.setAttribute('d', describeArc(center, center, r, 0, angle));
    }
}


function createDayTracker(day, levels = emptyArray, today = false) {
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    if (today) {
        svg.setAttribute("class", "today-tracker");
    } else {
        svg.setAttribute("class", "tracker");
    }

    const maxRadius = Math.max(...radii);
    const padding = 10;
    const width = (maxRadius + padding) * 2;
    const center = (maxRadius + padding);

    svg.setAttribute("viewBox", `0 0 ${width} ${width}`);

    for (let i = 0; i < emptyArray.length; i++) {
        const group = document.createElementNS(svgNS, "g");
        group.setAttribute("class", "goal");
        group.setAttribute("data-level", levels[i] ?? 0);

        const circle = document.createElementNS(svgNS, "circle");
        circle.setAttribute("class", "bg");
        circle.setAttribute("cx", center);
        circle.setAttribute("cy", center);
        circle.setAttribute("r", radii[i]);
        circle.setAttribute("fill", "none");
        circle.setAttribute("stroke", "#ccc");
        circle.setAttribute("stroke-width", "16");

        const path = document.createElementNS(svgNS, "path");
        path.setAttribute("class", "fill");
        path.setAttribute("stroke", colors[i]);
        path.setAttribute("stroke-width", "16");
        path.setAttribute("fill", "none");

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

    const label = document.createElement("div");
    if (!today) {
        label.textContent = day;
    }

    label.style.marginBottom = "4px";

    wrapper.appendChild(label);
    wrapper.appendChild(svg);
    return wrapper;
}

// Helper: Save current state to localStorage
function saveStateToLocalStorage(monthKey, monthData) {
    const allData = JSON.parse(localStorage.getItem('trackerData') || '{}');
    allData[monthKey] = monthData;
    localStorage.setItem('trackerData', JSON.stringify(allData));
}


// Helper: Load from localStorage or fallback to fetched data.json
async function loadData(monthKey) {
    const allData = JSON.parse(localStorage.getItem('trackerData') || '{}');

    if (!allData[monthKey]) {
        const daysInMonth = new Date(...monthKey.split("-").map(Number), 0).getDate();
        allData[monthKey] = Array.from({ length: daysInMonth }, () => [...emptyArray]);
        localStorage.setItem('trackerData', JSON.stringify(allData));
    }

    return allData[monthKey];
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

        let data = await loadData(monthStr);
        if (data.length < daysInMonth) {
            for (let i = data.length; i < daysInMonth; i++) {
                data[i] = emptyArray;
            }
        }

        // --- Focus Day Section ---
        const todayLevels = data[focusDay - 1] || emptyArray;
        const todayWrapper = document.createElement('div');
        todayWrapper.className = "today-wrapper";

        const todayTracker = createDayTracker(focusDay, todayLevels, true);
        todayWrapper.appendChild(todayTracker);

        const inputPanel = document.createElement('div');
        inputPanel.innerHTML = "<strong>Set fill levels (0–2):</strong><br>";

        const goalGroups = todayTracker.querySelectorAll(".goal");

        labels.forEach((label, i) => {
            const row = document.createElement("div");
            row.style.display = "flex";
            row.style.alignItems = "center";
            row.style.marginBottom = "4px";
            row.style.gap = "8px";

            const span = document.createElement("span");
            span.textContent = `${label}: `;
            span.style.color = colors[i];

            const input = document.createElement("input");
            input.className = "level-input";
            input.type = "number";
            input.min = "0";
            input.max = "2";
            input.value = todayLevels[i];
            input.style.width = "4em";
            input.style.marginLeft = "auto";

            input.addEventListener("change", () => {
                let val = Math.max(0, Math.min(2, parseInt(input.value, 10) || 0));
                input.value = val;
                const group = goalGroups[i];
                const path = group.querySelector(".fill");
                group.setAttribute("data-level", val);
                updateArc(path, val, radii[i]);
                data[focusDay - 1][i] = val;
                saveStateToLocalStorage(monthStr, data);
                render(monthStr, focusDay);
            });

            row.appendChild(span);
            row.appendChild(input);
            inputPanel.appendChild(row);
        });

        todayWrapper.appendChild(inputPanel);

        // --- Notes Section ---
        const notesKey = `${monthStr}-${focusDay}`;
        let allData = JSON.parse(localStorage.getItem('trackerData') || '{}');
        const note = allData.notes?.[notesKey] || "";

        const notesInput = document.getElementById("daily-notes");
        notesInput.addEventListener("input", () => {
            const updatedData = JSON.parse(localStorage.getItem('trackerData') || '{}');
            if (!updatedData.notes) updatedData.notes = {};
            updatedData.notes[notesKey] = notesInput.value;
            localStorage.setItem('trackerData', JSON.stringify(updatedData));
        });

        todayContainer.appendChild(todayWrapper);

        // --- Grid of the Month ---
        for (let day = 1; day <= daysInMonth; day++) {
            const levels = data[day - 1] || emptyArray;
            const tracker = createDayTracker(day, levels);
            grid.appendChild(tracker);
        }

        // Clickable tracking
        // Clickable tracking for today view
        todayTracker.querySelectorAll('.goal').forEach((goal, i) => {
            const path = goal.querySelector('.fill');
            const radius = parseFloat(goal.querySelector('.bg').getAttribute('r'));

            goal.addEventListener('click', () => {
                let level = parseInt(goal.getAttribute('data-level'), 10);
                level = (level + 1) % 3;
                goal.setAttribute('data-level', level);
                updateArc(path, level, radius);

                data[focusDay - 1][i] = level;
                saveStateToLocalStorage(monthStr, data);

                render(monthStr, focusDay); // Re-render to update the view
            });

        });

        // Clickable tracking for month grid
        grid.querySelectorAll('.goal').forEach((goal) => {
            const path = goal.querySelector('.fill');
            const radius = parseFloat(goal.querySelector('.bg').getAttribute('r'));

            goal.addEventListener('click', () => {
                let level = parseInt(goal.getAttribute('data-level'), 10);
                level = (level + 1) % 3;
                goal.setAttribute('data-level', level);
                updateArc(path, level, radius);

                const group = goal.parentElement;
                const dayWrapper = group.parentElement;
                const dayLabel = dayWrapper.querySelector('div');
                const dayNumber = parseInt(dayLabel.textContent, 10);
                const ringIndex = radii.indexOf(radius);

                if (dayNumber && ringIndex !== -1) {
                    data[dayNumber - 1][ringIndex] = level;
                    saveStateToLocalStorage(monthStr, data);
                }

                render(monthStr, focusDay); // Re-render to update the view
            });
        });

        const streaksContainer = document.getElementById("streak-counters");
        const summaryMonthContainer = document.getElementById("month-summary");
        const summaryYearContainer = document.getElementById("year-summary");

        streaksContainer.innerHTML = "";
        summaryMonthContainer.innerHTML = "";
        summaryYearContainer.innerHTML = "";

        // Initialize streaks per category
        let streaks = Array(emptyArray.length).fill(0);
        let streakBroken = Array(emptyArray.length).fill(false);

        // Parse selected date
        const currentDate = new Date(year, month - 1, focusDay);
        allData = JSON.parse(localStorage.getItem('trackerData') || '{}');

        // Go backwards in time day by day
        while (streakBroken.some(broken => !broken)) {
            const key = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
            const monthData = allData[key];
            if (!monthData) break;

            const dayIndex = currentDate.getDate() - 1;
            const levels = monthData[dayIndex] ?? emptyArray;

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
        for (let i = 0; i < categories.length; i++) {
            const streak = streaks[i];

            // Choose emoji based on streak length
            let emoji = "";
            if (streak >= 20) {
                times = Math.floor((streak - 10) / 10);
                emoji = "🔥".repeat(times);
            } else if (streak >= 15) {
                emoji = "🏅";
            } else if (streak >= 10) {
                emoji = "💪";
            } else if (streak >= 5) {
                emoji = "✨";
            }

            const line = document.createElement("div");
            line.textContent = `${emoji ? emoji + " " : ""}${labels[i]}: ${streak} day${streak === 1 ? '' : 's'}`;
            line.style.color = colors[i];
            line.style.marginBottom = "4px";
            streaksContainer.appendChild(line);
        }

        // Summary for the selected month
        today = new Date();
        const selectedDate = new Date(y, m - 1, focusDay);
        isCurrentMonth = today.getFullYear() === year && today.getMonth() + 1 === month;
        dayCutoff = isCurrentMonth ? today.getDate() : daysInMonth;
        const monthAverages = computeAverages(data, dayCutoff);
        summaryMonthContainer.appendChild(createSummaryTracker("Month", monthAverages));

        // Summary for the selected year
        let yearTotal = Array(emptyArray.length).fill(0);
        let yearDays = 0;

        for (let mo = 1; mo <= 12; mo++) {
            const key = `${y}-${String(mo).padStart(2, '0')}`;
            const monthData = JSON.parse(localStorage.getItem('trackerData') || '{}')[key];
            if (!monthData) continue;

            const maxDay = (y === today.getFullYear() && mo === today.getMonth() + 1) ? today.getDate() : monthData.length;
            for (let i = 0; i < maxDay; i++) {
                for (let j = 0; j < emptyArray.length; j++) {
                    yearTotal[j] += monthData[i]?.[j] ?? 0;
                }
            }
            yearDays += maxDay;
        }

        const yearAverages = yearTotal.map(sum => (sum / (yearDays || 1)) / 2);
        summaryYearContainer.appendChild(createSummaryTracker("Year", yearAverages));
    }

    // Attach change listeners
    monthInput.addEventListener('change', () => {
        render(monthInput.value, parseInt(dayInput.value, 10));
    });
    dayInput.addEventListener('change', () => {
        render(monthInput.value, parseInt(dayInput.value, 10));
    });

    function createSummaryTracker(label, averageLevels) {
        const tracker = createDayTracker(label, averageLevels.map(p => -p * 2), true);

        const labelDiv = document.createElement("div");
        labelDiv.style.marginBottom = "8px";
        labelDiv.textContent = label;

        const container = document.createElement("div");
        container.style.display = "inline-block";
        container.style.margin = "0 10px";
        container.style.textAlign = "center";

        container.appendChild(labelDiv);
        container.appendChild(tracker);

        return container;
    }

    // Calculate percentages
    function computeAverages(data, dayLimit) {
        const total = Array(emptyArray.length).fill(0);
        for (let i = 0; i < dayLimit && i < data.length; i++) {
            for (let j = 0; j < emptyArray.length; j++) {
                total[j] += data[i]?.[j] ?? 0;
            }
        }
        return total.map(sum => (sum / (dayLimit || 1)) / 2);  // Normalize: level 2 = 100%
    }


    // Initial render
    render(defaultMonthStr, defaultDay);
}

window.addEventListener('DOMContentLoaded', initTracker);

//MARK: Export/Import
document.getElementById('export-btn').addEventListener('click', () => {
    const allData = JSON.parse(localStorage.getItem('trackerData') || '{}');
    const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'tracker-data.json';
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

    const trackerData = JSON.parse(localStorage.getItem('trackerData') || '{}');

    try {
        const response = await fetch('https://tutorial-worker.pvanoostveenneo2.workers.dev/tracker', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username,
                password,
                data: trackerData
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

