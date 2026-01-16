url = "https://tutorial-worker.pvanoostveenneo2.workers.dev/steam"
appId = '';
steamId = '';

game = [];
player = [];
custom = [];

async function fetchGameAchievements(appId) {
    let response = await fetch(url + '/achievements', {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({ appId: appId }),
    });
    response = await response.json();
    return response;
}

async function fetchPlayerAchievements(appId, steamId) {
    console.log(appId);
    console.log(steamId);
    let response = await fetch(url + '/player', {
        method: 'POST',
        body: JSON.stringify({ appId: appId, steamId: steamId }),
    });
    response = await response.json();
    return response;
}

async function fetchSteamId(name) {
    let response = await fetch(url + '/fetchSteamId', {
        method: 'POST',
        body: JSON.stringify({ url: name }),
    });
    response = await response.json();
    console.log(response);
    return response;
}

async function fetchGameId(name) {
    let response = await fetch(url + '/fetchGameId', {
        method: 'POST',
        body: JSON.stringify({ gameName: name }),
    });
    response = await response.json();
    console.log(response.items.name);
    console.log(name);

    games = response.items.filter(app => app.name.toLowerCase() === name.toLowerCase());
    console.log(games);
    if (games.length === 0) {
        games = response.items.filter(app => app.name.toLowerCase().includes(name.toLowerCase()));
    }
    console.log(games);
    return games;
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
        if (custom[checkbox.name].length === 0) {
            delete custom[checkbox.name];
        }
        checkbox.checked = false;
    });

    localStorage.setItem(appId, JSON.stringify(custom));
    displayGameAchievements();
}

function displayGameAchievements() {
    const categorizedAchievements = document.getElementById('categorizedAchievements');
    categorizedAchievements.innerHTML = '';

    for (const [category, achievements] of Object.entries(custom)) {
        let table = document.createElement('table');


        let row = document.createElement('tr');
        let cell = document.createElement('th');
        let categoryHeader = document.createElement('h2');
        categoryHeader.textContent = category;
        cell.setAttribute('colspan', '4');
        cell.appendChild(categoryHeader);
        row.appendChild(cell);
        table.appendChild(row);

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

    let split = document.getElementById('divideAchieved').checked;

    if (split) {
        let achieved = uncategorized.filter(achievement => player.some(playerAchievement => playerAchievement.apiname === achievement.name && playerAchievement.achieved === 1));
        let unachieved = uncategorized.filter(achievement => !player.some(playerAchievement => playerAchievement.apiname === achievement.name && playerAchievement.achieved === 1));

        let table = document.createElement('table');
        let row = document.createElement('tr');
        let cell = document.createElement('th');
        let categoryHeader = document.createElement('h2');
        categoryHeader.textContent = 'Unachieved Uncategorized';
        cell.setAttribute('colspan', '4');
        cell.appendChild(categoryHeader);
        row.appendChild(cell);
        table.appendChild(row);

        unachieved.forEach(achievement => {
            let row = displayRow(achievement, '');
            table.appendChild(row);
        });
        categorizedAchievements.appendChild(table);

        table = document.createElement('table');
        row = document.createElement('tr');
        cell = document.createElement('th');
        categoryHeader = document.createElement('h2');
        categoryHeader.textContent = 'Achieved Uncategorized';
        cell.setAttribute('colspan', '4');
        cell.appendChild(categoryHeader);
        row.appendChild(cell);
        table.appendChild(row);

        achieved.forEach(achievement => {
            let row = displayRow(achievement, '');
            table.appendChild(row);
        });
        categorizedAchievements.appendChild(table);
    }
    else {
        let table = document.createElement('table');
        let row = document.createElement('tr');
        let cell = document.createElement('th');
        let categoryHeader = document.createElement('h2');
        categoryHeader.textContent = 'Uncategorized';
        cell.setAttribute('colspan', '4');
        cell.appendChild(categoryHeader);
        row.appendChild(cell);
        table.appendChild(row);

        uncategorized.forEach(achievement => {
            let row = displayRow(achievement, '');
            table.appendChild(row);
        });
        categorizedAchievements.appendChild(table);
    }
}

function displayRow(achievement, category) {
    //console.log(achievement);
    let row = document.createElement('tr');

    let listItem = document.createElement('th');
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

    console.log(appId + ' ' + steamId);

    if (appId === '' || steamId === '') {
        alert('Please fill in both fields');
        return;
    }

    if (isNaN(steamId)) {
        fetched = await fetchSteamId(steamId);
        if (fetched.response.success !== 1) {
            alert('Invalid Custom Url');
            return;
        }
        steamId = fetched.response.steamid;
    }

    if (isNaN(appId)) {
        fetched = await fetchGameId(appId);
        if (fetched.length === 0) {
            alert('Invalid Game Name');
            return;
        }
        // appId = fetched[fetched.length - 1].appid;
        appId = fetched[0].id;
        console.log('Fetched AppID: ' + appId);
    }

    if (localStorage.getItem(appId === null)) {
        localStorage.setItem(appId, JSON.stringify([]));
    }

    localStorage.setItem('lastUsedAppId', appId);
    localStorage.setItem('lastUsedSteamId', steamId);

    game = await fetchGameAchievements(appId)
    player = await fetchPlayerAchievements(appId, steamId);
    custom = JSON.parse(localStorage.getItem(appId));
    if (!custom) {
        custom = {};
    }
    displayGameAchievements();
}

if (localStorage.getItem('lastUsedAppId') && localStorage.getItem('lastUsedSteamId')) {
    document.getElementById('appId').value = localStorage.getItem('lastUsedAppId');
    document.getElementById('steamId').value = localStorage.getItem('lastUsedSteamId');
    getSteamData();
}

start = document.getElementById('getAchievements');
start.addEventListener('click', getSteamData);

categorize = document.getElementById('categorizeButton');
categorize.addEventListener('click', categorizeAchievements);

uncategorize = document.getElementById('uncategorizeButton');
uncategorize.addEventListener('click', uncategorizeAchievements);

divideAchieved = document.getElementById('divideAchieved')
divideAchieved.addEventListener('change', displayGameAchievements);

exportButton = document.getElementById('exportButton');
exportButton.addEventListener('click', () => {
    const element = document.createElement(`a`);
    save = {};
    save.content = JSON.parse(localStorage.getItem(appId));
    save.appId = appId;
    save.steamId = steamId;
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(save)));
    element.setAttribute('download', `${appId}.json`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
});

importButton = document.getElementById('importButton');
importButton.addEventListener('change', (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function (e) {
        custom = JSON.parse(e.target.result).content;
        appId = JSON.parse(e.target.result).appId;
        steamId = JSON.parse(e.target.result).steamId;
        localStorage.setItem('lastUsedAppId', appId);
        localStorage.setItem('lastUsedSteamId', steamId);
        console.log(appId);
        appId = Number(appId);
        localStorage.setItem(JSON.stringify(appId), JSON.stringify(custom));
        location.reload();
    }
    reader.readAsText(file);
});