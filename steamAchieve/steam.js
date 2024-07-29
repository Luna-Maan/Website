url = "https://tutorial-worker.pvanoostveenneo2.workers.dev/steam"
appId = '';
steamId = '';

game = [];
player = [];
custom = [];

async function fetchGameAchievements(appId) {
    let response = await fetch(url + '/achievements', {
        method: 'POST',
        body: JSON.stringify({ appId: appId }),
    });
    response = await response.json();
    return response;
}

async function fetchPlayerAchievements(appId, steamId) {
    let response = await fetch(url + '/player', {
        method: 'POST',
        body: JSON.stringify({ appId: appId, steamId: steamId }),
    });
    response = await response.json();
    return response;
}

function categorizeAchievements() {
    const category = document.getElementById('category-name').value;
    if (!category) {
        alert('Please enter a category name.');
        return;
    }

    const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
    if (checkboxes.length === 0) {
        alert('Please select achievements to categorize.');
        return;
    }

    if (!custom[category]) {
        custom[category] = [];
    }

    checkboxes.forEach(checkbox => {
        if (!custom[category].includes(checkbox.value)) {
            custom[category].push(checkbox.value);
        }
        checkbox.checked = false;
    });

    localStorage.setItem(appId, JSON.stringify(custom));
    displayGameAchievements();
}

function uncategorizeAchievements() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
    if (checkboxes.length === 0) {
        alert('Please select achievements to uncategorize.');
        return;
    }

    checkboxes.forEach(checkbox => {
        custom[checkbox.name] = custom[checkbox.name].filter(achievement => achievement !== checkbox.value);
        checkbox.checked = false;
    });

    localStorage.setItem(appId, JSON.stringify(custom));
    displayGameAchievements();
}

async function removeAchievement(name) {
    if (savedAchievements.includes(name)) {
        custom.savedAchievements = custom.savedAchievements.filter(achievement => achievement !== name);
        localStorage.setItem(appId, JSON.stringify(custom.savedAchievements));
        displayGameAchievements();
    }
}

function displayGameAchievements() {
    const categorizedAchievements = document.getElementById('categorizedAchievements');
    categorizedAchievements.innerHTML = '';

    for (const [category, achievements] of Object.entries(custom)) {
        let categoryHeader = document.createElement('h2');
        categoryHeader.textContent = category;
        categorizedAchievements.appendChild(categoryHeader);

        let table = document.createElement('table');
        achievements.forEach(achievementName => {
            achievement = game.find(gameAchievement => gameAchievement.displayName === achievementName);
            let row = displayRow(achievement, category);
            table.appendChild(row);
        });
        categorizedAchievements.appendChild(table);
    }

    uncategorized = game.filter(achievement => {
        return !Object.values(custom).flat().includes(achievement.displayName);
    });

    let categoryHeader = document.createElement('h2');
    categoryHeader.textContent = 'Uncategorized';
    categorizedAchievements.appendChild(categoryHeader);

    let table = document.createElement('table');
    uncategorized.forEach(achievement => {
        let row = displayRow(achievement, '');
        table.appendChild(row);
    });
    categorizedAchievements.appendChild(table);
}

function displayRow(achievement, category) {
    console.log(achievement);
    let row = document.createElement('tr');

    let listItem = document.createElement('td');
    const label = document.createElement('label');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    if (category) {
        checkbox.name = category
    }
    checkbox.value = achievement.displayName;
    label.appendChild(checkbox);
    listItem.appendChild(label);
    row.appendChild(listItem);

    listItem = document.createElement('td');
    const image = document.createElement('img');

    if (player.some(playerAchievement => playerAchievement.apiname === achievement.name && playerAchievement.achieved === 1)) {
        image.src = achievement.icon;
    }
    else {
        image.src = achievement.icongray;
    }

    listItem.appendChild(image);
    row.appendChild(listItem);

    listItem = document.createElement('td');
    listItem.textContent = achievement.displayName;
    row.appendChild(listItem);

    listItem = document.createElement('td');
    listItem.textContent = achievement.description;
    row.appendChild(listItem);

    return row;
}

async function getSteamData() {
    appId = document.getElementById('appId').value;
    steamId = document.getElementById('steamId').value;

    if (appId === '' || steamId === '') {
        alert('Please fill in both fields');
        return;
    }

    if (localStorage.getItem(appId === null)) {
        localStorage.setItem(appId, JSON.stringify([]));
    }

    game = await fetchGameAchievements(appId)
    player = await fetchPlayerAchievements(appId, steamId);
    custom = JSON.parse(localStorage.getItem(appId));
    if (!custom) {
        custom = {};
    }
    if (!custom.savedAchievements) {
        custom.savedAchievements = [];
    }
    displayGameAchievements();
}

start = document.getElementById('getAchievements');
start.addEventListener('click', getSteamData);

categorize = document.getElementById('categorizeButton');
categorize.addEventListener('click', categorizeAchievements);

uncategorize = document.getElementById('uncategorizeButton');
uncategorize.addEventListener('click', uncategorizeAchievements);