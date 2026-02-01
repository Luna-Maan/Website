const version = "1.0";

let defaultColors = [
    "#5cd670ff",
    "#d6ce5cff",
    "#d6935cff",
    "#d65c64ff",
    "#d65cb8ff",
    "#7a5cd6ff",
    "#5c8fd6ff"
];

let defaultCategories = [
    "Fruit",
    "Shower",
    "Exercise (30m/60m)",
    "Screen Time (2h/1h30)",
    "Browser Time (1h30/1h)",
    "Sleep (6h30/7h30)",
    "Bed Time (1:30/0:30)"
];

export const Data = {
    version: version,
    categories: [],
    colors: [],
    notes: {},
    months: {},

    init() {
        const allData = localStorage.getItem("trackerData");

        if (!allData) {
            this.setDefaults();
            return this;
        }

        if (allData) {
            try {
                const parsed = JSON.parse(allData);

                // --- DATA MIGRATION LOGIC ---
                if (!parsed.version || parsed.version < version) {
                    console.log("Migrating data to version 1.0...");
                    this.version = version;
                    this.months = {};
                    // Move old root-level keys (e.g., "2025-06") into the months object
                    Object.keys(parsed).forEach(key => {
                        if (/^\d{4}-\d{2}$/.test(key)) { // Matches "YYYY-MM"
                            this.months[key] = parsed[key];
                        }
                    });
                    this.notes = parsed.notes || {};
                    this.categories = parsed.categories || [...defaultCategories];
                    this.colors = parsed.colors || [...defaultColors];
                    this.persist(); // Save migrated format immediately
                } else {
                    this.categories = parsed.categories;
                    this.colors = parsed.colors;
                    this.notes = parsed.notes;
                    this.months = parsed.months;
                }
            } catch (e) {
                console.error("Critical: Storage corrupted.", e);
                this.setDefaults();
            }
        }
        return this;
    },

    setDefaults() {
        this.version = version;
        this.categories = [...defaultCategories];
        this.colors = [...defaultColors];
        this.notes = {};
        this.months = {};
        this.persist();
    },

    persist() {
        const allData = {
            version: this.version,
            categories: this.categories,
            colors: this.colors,
            notes: this.notes,
            months: this.months
        };
        localStorage.setItem("trackerData", JSON.stringify(allData));
    },

    getState() {
        return {
            version: this.version,
            categories: this.categories,
            colors: this.colors,
            notes: this.notes,
            months: this.months
        };
    },

    getMonthData(monthKey) {
        if (!this.months[monthKey]) {
            const daysInMonth = new Date(...monthKey.split("-").map(Number), 0).getDate();
            this.months[monthKey] = Array.from({ length: daysInMonth }, () => Array(this.categories.length).fill(0));
            this.persist();
        }
        return this.months[monthKey];
    },

    setDayLevel(monthKey, dayIndex, categoryIndex, level) {
        console.log(`Setting level for ${monthKey}, day ${dayIndex}, category ${categoryIndex} to ${level}`);
        const monthData = this.getMonthData(monthKey);
        monthData[dayIndex][categoryIndex] = level;
        this.persist();
    },

    setNote(notesKey, note) {
        this.notes[notesKey] = note;
        this.persist();
    },

    updateMetaData(newCategories, newColors) {
        this.categories = [...newCategories];
        this.colors = [...newColors];
        this.persist();
    }
};