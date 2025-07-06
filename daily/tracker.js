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
    const clamped = Math.max(-2, Math.min(2, level));
    const angle = (clamped / 2) * 360;
    if (angle == 0) {
        path.setAttribute('d', '');
    } else if (angle >= 360) {
        // Draw full circle with two arcs
        const cx = 115, cy = 115;
        const d = `
            M ${cx - r}, ${cy}
            a ${r},${r} 0 1,1 ${2 * r},0
            a ${r},${r} 0 1,1 ${-2 * r},0
        `;
        path.setAttribute('d', d.trim());
    } else if (angle <= -180) {
        const cx = 115, cy = 115;
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
        path.setAttribute('d', describeArc(115, 115, r, 0, angle));
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
    svg.setAttribute("viewBox", "0 0 230 230");

    for (let i = 0; i < emptyArray.length; i++) {
        const group = document.createElementNS(svgNS, "g");
        group.setAttribute("class", "goal");
        group.setAttribute("data-level", levels[i] ?? 0);

        const circle = document.createElementNS(svgNS, "circle");
        circle.setAttribute("class", "bg");
        circle.setAttribute("cx", "115");
        circle.setAttribute("cy", "115");
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
            });

            row.appendChild(span);
            row.appendChild(input);
            inputPanel.appendChild(row);
        });

        todayWrapper.appendChild(inputPanel);
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

        const summaryMonthContainer = document.getElementById("month-summary");
        const summaryYearContainer = document.getElementById("year-summary");

        summaryMonthContainer.innerHTML = "";
        summaryYearContainer.innerHTML = "";
        // Summary for the selected month
        today = new Date();
        const selectedDate = new Date(y, m - 1, focusDay);
        const isCurrentMonth = today.getFullYear() === year && today.getMonth() + 1 === month;
        const dayCutoff = isCurrentMonth ? today.getDate() : daysInMonth;
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

const labels = ["Fruit", "Shower", "Exercise (30m/60m)", "Screen Time (2h/1h30)", "Browser Time (1h30/1h)", "sleep (6h30/7h30)", "Bed Time (1:30/0:30)"];
const radii = [104, 88, 72, 56, 40, 24, 8];
const emptyArray = [0, 0, 0, 0, 0, 0, 0];
const colors = ["darkgreen", "green", "#6A7FDB", "#6D3B47", "darkred", "purple", "darkblue"];

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
        alert("Username and password are required.");
        return;
    }

    const trackerData = JSON.parse(localStorage.getItem('trackerData') || '{}');

    try {
        const response = await fetch('https://storage.pro-gramming.net/store', {
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
        alert("Username and password are required.");
        return;
    }

    try {
        // Assuming your GET endpoint uses query params for auth, e.g.:
        // https://storage.pro-gramming.net/retrieve?username=...&password=...
        // (Adjust the URL and parameters according to your API)
        const url = `https://storage.pro-gramming.net/retrieve?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`;

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

        // Save loaded data to localStorage
        localStorage.setItem('trackerData', JSON.stringify(json.data));

        alert("Successfully loaded data from the cloud!");

        // Re-render tracker with new data
        // Assuming initTracker or render function will pick up the changes on reload
        location.reload();

    } catch (err) {
        alert("Error loading data: " + err.message);
    }
});
