import { Data } from './data.js';

export const TrackerUI = {

    /**
     * 
     * @param {*} day 
     * @param {*} levels 
     * @param {*} type 'today' or 'summary' or 'day'
     * @returns 
     */
    createDayTracker(dayNr, levels, type, radii) {
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
            const group = this._createElNS("g");
            group.classList.add("goal");
            group.dataset.index = i;
            group.dataset.dayNr = dayNr;
            group.dataset.level = levels[i] ?? 0;
            group.dataset.radius = radii[i];

            const circle = this._createElNS("circle", {
                class: "bg",
                cx: center,
                cy: center,
                r: radii[i],
                fill: "none",
                stroke: "#d6d6d6ff",
                "stroke-width": "16"
            });

            const path = this._createElNS("path", {
                class: "fill",
                stroke: Data.colors[i],
                "stroke-width": "16",
                fill: "none"
            });
            path.dataset.index = i;
            path.dataset.dayNr = dayNr;

            this.updateArc(path, levels[i] ?? 0, radii[i], radii);

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
    },

    createSummaryTracker(label, averageLevels, radii) {
        const tracker = this.createDayTracker(label, averageLevels.map(p => -p * 2), "summary", radii);

        const container = document.createElement("div");
        container.style.display = "inline-block";
        container.style.margin = "0 10px";
        container.style.textAlign = "center";
        container.appendChild(tracker);

        return container;
    },

    updateMonthRing(dayNr, ringIndex, level, radii) {
        const grid = document.getElementById("tracker-grid");
        const gridDay = grid.querySelector(`.day-wrapper[data-day-nr='${dayNr}']`);
        if (!gridDay) return;

        // Find the specific goal group for this index
        const goalGroup = gridDay.querySelector(`.goal[data-index='${ringIndex}']`);
        if (!goalGroup) return;

        goalGroup.setAttribute('data-level', level);

        const fillPath = goalGroup.querySelector('.fill');
        const radius = parseFloat(goalGroup.querySelector('.bg').getAttribute('r'));

        this.updateArc(fillPath, level, radius, radii);
    },



    updateArc(path, level, r, radii) {
        const maxRadius = Math.max(...radii);
        const padding = 10;
        const center = (maxRadius + padding);
        const angle = (level / 2) * 360;

        if (angle === 0) {
            path.setAttribute('d', '');
        } else {
            // Always start from the top (0°) and go to the calculated angle
            path.setAttribute('d', this._getArcPath(center, center, r, 0, angle));
        }
    },

    _getArcPath(x, y, r, startAngle, endAngle) {
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
    },


    _createElNS(tag, attrs = {}) {
        const svgNS = "http://www.w3.org/2000/svg";
        const el = document.createElementNS(svgNS, tag);
        Object.entries(attrs).forEach(([k, v]) => {
            if (v == null) return;
            el.setAttribute(k, String(v));
        });
        return el;
    }
}