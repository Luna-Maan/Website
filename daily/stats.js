import { Data } from './data.js';
import { TrackerUI } from './tracker-ui.js';

export const stats = {
    async displayStreaks(monthStr, focusDay) {
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
    },

    displaySummary(monthStr, daysInMonth, radii) {
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
        const monthAverages = this._computeAverages(monthData || [], dayCutoff);
        summaryMonthContainer.appendChild(TrackerUI.createSummaryTracker("Month", monthAverages, radii));

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
        summaryYearContainer.appendChild(TrackerUI.createSummaryTracker("Year", yearAverages, radii));
    },

    _computeAverages(data, dayLimit) {
        const total = Array(Data.categories.length).fill(0);
        for (let i = 0; i < dayLimit && i < data.length; i++) {
            for (let j = 0; j < Data.categories.length; j++) {
                total[j] += data[i]?.[j] ?? 0;
            }
        }
        return total.map(sum => (sum / (dayLimit || 1)) / 2);  // Normalize: level 2 = 100%
    }
}