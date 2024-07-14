// Sample data structure with multiple options for each requirement
const rows = [
    {
        id: 1, gods: ['zeus', 'hera'], subrows: [
            ['req1a', 'req2a'],
            ['req3a'],
        ]
    },
    {
        id: 2, gods: ['zeus', 'hera'], subrows: [
            ['volcanic', 'volcanic', 'Arctic Ring', 'Frigid Sprint', 'Tranquil Gain', 'Cold Storage', 'Rare Crop', 'Snow Queen'],
            ['req4a']
        ]
    },
    {
        id: 3, gods: ['zeus', 'hera'], subrows: [
            ['req1a'],
            ['req4a', 'req5a']
        ]
    },
    // Add more rows as needed
];

let gottenRequirements = [];

function calculatePercentageMet(row) {
    const totalSubrows = row.subrows.length;
    const metSubrows = row.subrows.filter(subrow =>
        subrow.some(req => gottenRequirements.includes(req)))
        .length;
    return (metSubrows / totalSubrows) * 100;
}

function getRowClass(percentageMet) {
    if (percentageMet >= 75) return 'high';
    if (percentageMet >= 50) return 'medium';
    return 'low';
}

function renderRows() {
    const container = document.getElementById('rows-container');
    container.innerHTML = '';

    // Sort rows by the percentage of subrows that have at least one requirement met
    const sortedRows = rows.slice().sort((a, b) => {
        const aPercentageMet = calculatePercentageMet(a);
        const bPercentageMet = calculatePercentageMet(b);
        return bPercentageMet - aPercentageMet;
    });

    // Render rows
    sortedRows.forEach(row => {
        const percentageMet = calculatePercentageMet(row);
        const rowClass = getRowClass(percentageMet);

        row.subrows.forEach((subrow, index) => {
            const rowElement = document.createElement('tr');
            if (index === 0) {
                const idCell = document.createElement('td');
                idCell.className = rowClass;
                idCell.rowSpan = row.subrows.length;
                idCell.textContent = `Row ${row.id}`;
                rowElement.appendChild(idCell);
            }

            const godCell = document.createElement('td');
            godCell.className = 'boon_god';
            godCell.textContent = row.gods[index];
            rowElement.appendChild(godCell);

            subrow.forEach(req => {
                const reqCell = document.createElement('td');
                reqCell.className = 'boon_req';

                if (gottenRequirements.includes(req)) {
                    reqCell.classList.add('met');
                }
                reqCell.textContent = req;
                reqCell.addEventListener('click', () => handleRequirementClick(req));

                rowElement.appendChild(reqCell);
            });

            container.appendChild(rowElement);
        });
    });
}

function handleRequirementClick(option) {
    if (!gottenRequirements.includes(option)) {
        gottenRequirements.push(option);
    }
    else {
        gottenRequirements.pop(option);
    }
    renderRows();
}

// Initial render
renderRows();