const monsterListElement = document.getElementById('monster-list');
const monsterInfoElement = document.getElementById('monster-info');

let currentPageUrl = 'https://api.open5e.com/monsters/';

const prevPageButton = document.getElementById('prev-page-button');
const nextPageButton = document.getElementById('next-page-button');

document.getElementById('search-button').addEventListener('click', function() {
    var searchBox = document.getElementById('search-box');
    var monsterName = searchBox.value;

    fetch(`https://api.open5e.com/monsters/${monsterName}/`)
        .then(response => response.json())
        .then(data => fetchAndDisplayMonsterInfo(data));
});

async function fetchMonsters() {
    const response = await fetch(currentPageUrl);
    const data = await response.json();

    // Update page buttons
    prevPageButton.disabled = !data.previous;
    nextPageButton.disabled = !data.next;

    currentPageUrl = response.url;

    displayMonsterList(data.results);
}

function displayMonsterList(monsters) {
    // Clear previous list
    while (monsterListElement.firstChild) {
        monsterListElement.firstChild.remove();
    }

    monsters.sort((a, b) => a.name.localeCompare(b.name)); // Sort monsters alphabetically
    for (const monster of monsters) {
        const li = document.createElement('li');
        li.textContent = monster.name;
        li.addEventListener('click', () => fetchAndDisplayMonsterInfo(monster));
        monsterListElement.appendChild(li);
    }
}

async function fetchAndDisplayMonsterInfo(monster) {
    // Clear previous monster info
    while (monsterInfoElement.firstChild) {
        monsterInfoElement.firstChild.remove();
    }

    const response = await fetch(`https://api.open5e.com/monsters/${monster.slug}`);
    const data = await response.json();

    const h2 = document.createElement('h2');
    h2.textContent = data.name;
    monsterInfoElement.appendChild(h2);

    const img = document.createElement('img');
    img.src = data.image ? data.image : "https://slyflourish.com/images/zalto.jpg"; // Replace "default_image_url" with the URL of your default image
    img.alt = data.name;
    monsterInfoElement.appendChild(img);

    const pSize = document.createElement('p');
    pSize.textContent = `Size: ${data.size}`;
    monsterInfoElement.appendChild(pSize);

    const pType = document.createElement('p');
    pType.textContent = `Type: ${data.type}`;
    monsterInfoElement.appendChild(pType);

    const pAlignment = document.createElement('p');
    pAlignment.textContent = `Alignment: ${data.alignment}`;
    monsterInfoElement.appendChild(pAlignment);

    const pArmorClass = document.createElement('p');
    pArmorClass.textContent = `Armor Class: ${data.armor_class}`;
    monsterInfoElement.appendChild(pArmorClass);

    const pHitPoints = document.createElement('p');
    pHitPoints.textContent = `Hit Points: ${data.hit_points}`;
    monsterInfoElement.appendChild(pHitPoints);

    const pHitDice = document.createElement('p');
    pHitDice.textContent = `Hit Dice: ${data.hit_dice}`;
    monsterInfoElement.appendChild(pHitDice);

    const pSpeed = document.createElement('p');
    pSpeed.textContent = `Speed: Walk - ${data.speed.walk}, Fly - ${data.speed.fly}`;
    monsterInfoElement.appendChild(pSpeed);

    const pChallengeRating = document.createElement('p');
    pChallengeRating.textContent = `Challenge Rating: ${data.challenge_rating}`;
    monsterInfoElement.appendChild(pChallengeRating);

    const pLanguages = document.createElement('p');
    pLanguages.textContent = `Languages: ${data.languages}`;
    monsterInfoElement.appendChild(pLanguages);

    // Add more properties as needed
}

prevPageButton.addEventListener('click', async () => {
    const response = await fetch(currentPageUrl);
    const data = await response.json();

    if (data.previous) {
        currentPageUrl = data.previous;
        fetchMonsters();
    }
});

nextPageButton.addEventListener('click', async () => {
    const response = await fetch(currentPageUrl);
    const data = await response.json();

    if (data.next) {
        currentPageUrl = data.next;
        fetchMonsters();
    }
});

fetchMonsters();
