url = "https://tutorial-worker.pvanoostveenneo2.workers.dev/steam"
appId = '';
steamId = '';

player = '';

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

function trackAchievement(name, response) {
    console.log(name);
    let savedAchievements = JSON.parse(localStorage.getItem('savedAchievements')) || [];
    if (!savedAchievements.includes(name)) {
        savedAchievements.push(name);
        localStorage.setItem('savedAchievements', JSON.stringify(savedAchievements));
        displayGameAchievements(response);
    }
}

async function removeAchievement(name, response) {
    let savedAchievements = JSON.parse(localStorage.getItem('savedAchievements')) || [];
    if (savedAchievements.includes(name)) {
        savedAchievements = savedAchievements.filter(achievement => achievement !== name);
        localStorage.setItem('savedAchievements', JSON.stringify(savedAchievements));
        displayGameAchievements(response);
    }
}

function displayGameAchievements(response) {
    const trackedAchievementsList = document.getElementById('trackedAchievementsList');
    trackedAchievementsList.innerHTML = '';
    const gameAchievementsList = document.getElementById('otherAchievementsList');
    gameAchievementsList.innerHTML = '';

    response.forEach(achievement => {
        let row = displayRow(achievement);

        if (JSON.parse(localStorage.getItem('savedAchievements')).includes(achievement.displayName)) {
            row.addEventListener('click', () => removeAchievement(achievement.displayName, response));
            trackedAchievementsList.appendChild(row);
        }
        else {
            row.addEventListener('click', () => trackAchievement(achievement.displayName, response));
            gameAchievementsList.appendChild(row);
        }
    });
}

function displayRow(achievement) {
    let row = document.createElement('tr');

    let listItem = document.createElement('td');
    const image = document.createElement('img');

    const bool = player.some(playerAchievement => playerAchievement.apiname === achievement.name && playerAchievement.achieved === 1);

    if (bool) {
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

    response = await fetchGameAchievements(appId)
    player = await fetchPlayerAchievements(appId, steamId);
    displayGameAchievements(response);
}

start = document.getElementById('getAchievements');
start.addEventListener('click', getSteamData);