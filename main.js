const classSelect = document.getElementById('class-select');
const raceSelect = document.getElementById('race-select');
const abilityScoresDiv = document.getElementById('ability-scores');
const saveCharacterBtn = document.getElementById('save-character');
const createCharacterBtn = document.getElementById('create-character');
const showSavedCharactersBtn = document.getElementById('show-saved-characters');
const savedCharactersDiv = document.getElementById('saved-characters');
const hideSavedCharactersBtn = document.getElementById('hide-saved-characters');
const deleteCharacterBtn = document.getElementById('delete-character');
const abilityScores = ["Strength", "Dexterity", "Constitution", "Intelligence", "Wisdom", "Charisma"];
const hitPointsPerClass = {
    barbarian: 12,
    bard: 8,
    cleric: 8,
    druid: 8,
    fighter: 10,
    monk: 8,
    paladin: 10,
    ranger: 10,
    rogue: 8,
    sorcerer: 6,
    warlock: 8,
    wizard: 6,
  };

async function fetchClasses() {
    const response = await fetch('https://www.dnd5eapi.co/api/classes/');
    const data = await response.json();
    return data.results;
}

async function fetchRaces() {
    const response = await fetch('https://www.dnd5eapi.co/api/races/');
    const data = await response.json();
    return data.results;
}

function populateOptions(select, options) {
    options.forEach(option => {
        const opt = document.createElement('option');
        opt.value = option;
        opt.textContent = option;
        select.appendChild(opt);
    });
}

async function populateClassOptions() {
    const classes = await fetchClasses();
    populateOptions(classSelect, classes.map(c => c.name));
}

async function populateRaceOptions() {
    const races = await fetchRaces();
    populateOptions(raceSelect, races.map(r => r.name));
}

// ... rest of the code ...

function createAbilityScoreDropdowns() {
    const abilityDescriptions = {
        Strength: "This ability represents a character's physical power, including their ability to lift heavy objects, break objects, or perform feats of athleticism.",
        Dexterity: "Dexterity represents a character's agility, balance, and reflexes, affecting actions that require quick, precise movements.",
        Constitution: "Constitution represents a character's health and stamina, determining their ability to endure challenges and recover from injury.",
        Intelligence: "Intelligence represents a character's mental capacity, including their ability to learn, reason, and solve problems.",
        Wisdom: "Wisdom represents a character's intuition, perception, and willpower, affecting their ability to assess situations and make sound judgments.",
        Charisma: "Charisma represents a character's force of personality, charm, and leadership abilities, influencing their ability to persuade, deceive, or inspire others."
    };

    const standardArray = [15, 14, 13, 12, 10, 8];

    abilityScores.forEach((score) => {
        const label = document.createElement("label");
        label.textContent = `${score}:`;

        const select = document.createElement("select");
        select.id = `score-${score.toLowerCase()}`;
        select.setAttribute('data-ability', score.toLowerCase());
        select.classList.add("ability-score");

        const defaultOption = document.createElement("option");
        defaultOption.value = "";
        defaultOption.textContent = "Select";
        select.appendChild(defaultOption);

        standardArray.forEach((value) => {
            const option = document.createElement("option");
            option.value = value;
            option.textContent = value;
            select.appendChild(option);
        });

        select.addEventListener("change", () => {
            updateDropdowns(select);
            updateAbilityModifier(select);
        });

        const tooltip = document.createElement("span");
        tooltip.classList.add("tooltip");
        tooltip.textContent = abilityDescriptions[score];
        label.appendChild(tooltip);

        const modifierContainer = document.createElement("div");
        modifierContainer.classList.add("modifier-container");

        const modifierLabel = document.createElement("span");
        modifierLabel.textContent = "Modifier: ";

        const modifierSpan = document.createElement("span");
        modifierSpan.id = `modifier-${score.toLowerCase()}`;
        modifierSpan.classList.add("modifier-value");

        modifierContainer.appendChild(modifierLabel);
        modifierContainer.appendChild(modifierSpan);

        abilityScoresDiv.appendChild(label);
        abilityScoresDiv.appendChild(select);
        abilityScoresDiv.appendChild(modifierContainer);
        modifierSpan.classList.add("ability-modifier");
    });

    updateArmorClass(); // Add this line
}


function updateClassImage() {
    const characterClass = document.getElementById('class-select').value;
    const classImage = document.getElementById('class-image');
    classImage.src = `./images/${characterClass}.png`;
}



function calculateHitPoints(characterClass, constitutionModifier) {
    const hitPoints = hitPointsPerClass[characterClass.toLowerCase()] + constitutionModifier;
    return hitPoints;
  }

  function updateHitPoints() {
    const characterClass = document.getElementById("class-select").value;
    const constitutionModifier = parseInt(document.getElementById("modifier-constitution").textContent) || 0;
    const hitPoints = calculateHitPoints(characterClass, constitutionModifier);
    const hitDice = `1d${hitPointsPerClass[characterClass.toLowerCase()]}`;
  
    document.getElementById("hit-dice").textContent = hitDice;
    document.getElementById("calculated-hp").textContent = hitPoints;
  }
  


function updateAbilityModifier(select) {
    const score = parseInt(select.value);
    const ability = select.id.split("-")[1];
    const modifierSpan = document.getElementById(`modifier-${ability}`);
    if (isNaN(score)) {
        modifierSpan.textContent = "";
        return;
    }
    
    const modifier = Math.floor((score - 10) / 2);
    modifierSpan.textContent = `${modifier >= 0 ? "+" : ""}${modifier}`;

    if (ability === 'dexterity') {
        updateArmorClass();
    }
}


function updateDropdowns(changedSelect) {
    const currentSelections = {};

    // Collect the current selections
    document.querySelectorAll('.ability-score').forEach(select => {
        const ability = select.id.split('-')[1];
        const selectedValue = parseInt(select.value);
        if (!isNaN(selectedValue)) {
            currentSelections[ability] = selectedValue;
        }
    });

    // Update the dropdowns based on the current selections
    document.querySelectorAll('.ability-score').forEach(select => {
        if (select === changedSelect) return;

        const ability = select.id.split('-')[1];
        const selectedValue = currentSelections[ability];

        // Remove all options except the first (placeholder) option
        Array.from(select.children).forEach((option, index) => {
            if (index !== 0) {
                select.removeChild(option);
            }
        });

        // Add options back based on the standard array and the current selections
        const standardArray = [15, 14, 13, 12, 10, 8];
        standardArray.forEach(score => {
            if (!Object.values(currentSelections).includes(score) || score === selectedValue) {
                const option = document.createElement('option');
                option.value = score;
                option.textContent = score;
                if (score === selectedValue) {
                    option.selected = true;
                }
                select.appendChild(option);
            }
        });
    });
}
function updateAbilityModifier(select) {
    const score = parseInt(select.value);
    const ability = select.id.split("-")[1];
    const modifierSpan = document.getElementById(`modifier-${ability}`);
    if (isNaN(score)) {
        modifierSpan.textContent = "";
        return;
    }
    
    const modifier = Math.floor((score - 10) / 2);
    modifierSpan.textContent = `${modifier >= 0 ? "+" : ""}${modifier}`;

    if (ability === 'dexterity') {
        updateArmorClass();
    }
}

function updateArmorClass() {
    const armorClassContainer = document.getElementById("armor-class");
    const dexterityModifierSpan = document.getElementById("modifier-dexterity");
    const dexterityModifier = parseInt(dexterityModifierSpan.textContent) || 0;
    const armorClass = 10 + dexterityModifier;
    armorClassContainer.querySelector(".stat-value").textContent = armorClass;
}


function getCharacterData() {
    const heroName = document.getElementById('hero-name').value;
    const heroClass = classSelect.value;
    const heroRace = raceSelect.value;
    const abilities = {};
    abilityScores.forEach(score => {
        abilities[score] = document.getElementById(`score-${score.toLowerCase()}`).value;
    });
    
    return {
        name: heroName,
        class: heroClass,
        race: heroRace,
        abilities: abilities
    };
}

function saveCharacter() {
const characters = JSON.parse(localStorage.getItem('characters')) || [];
if (characters.length >= 3) {
alert('You can only save up to 3 characters.');
return;
}


const characterData = getCharacterData();
characters.push(characterData);
localStorage.setItem('characters', JSON.stringify(characters));
alert('Character saved!');
}

function createCharacter() {
document.getElementById('hero-name').value = '';
classSelect.value = '';
raceSelect.value = '';
abilityScores.forEach(score => {
    document.getElementById(`score-${score.toLowerCase()}`).value = 0;
});

alert('New character created. Fill out the details and save the character when you are done.');
}

function showSavedCharacters() {
const characters = JSON.parse(localStorage.getItem('characters')) || [];
savedCharactersDiv.innerHTML = ''; // Clear any previous content
if (characters.length === 0) {
    savedCharactersDiv.innerHTML = 'No saved characters found.';
    return;
}

characters.forEach((character, index) => {
    const characterDiv = document.createElement('div');
    characterDiv.classList.add('saved-character');
    characterDiv.innerHTML = `
        <h3>Character ${index + 1}</h3>
        <p>Name: ${character.name}</p>
        <p>Class: ${character.class}</p>
        <p>Race: ${character.race}</p>
        <p>Abilities:</p>
        <ul>
            ${abilityScores.map(score => `<li>${score}: ${character.abilities[score]}</li>`).join('')}
        </ul>
    `;
    savedCharactersDiv.appendChild(characterDiv);
});

savedCharactersDiv.style.display = 'block';
}

function hideSavedCharacters() {
savedCharactersDiv.style.display = 'none';
}

function deleteCharacter() {
const characters = JSON.parse(localStorage.getItem('characters')) || [];
if (characters.length === 0) {
alert('No saved characters to delete.');
return;
}
const index = parseInt(prompt('Enter the index of the character you want to delete (1, 2, or 3):')) - 1;
if (index < 0 || index >= characters.length) {
    alert('Invalid character index. No character was deleted.');
    return;
}

characters.splice(index, 1);
localStorage.setItem('characters', JSON.stringify(characters));
alert('Character deleted.');
showSavedCharacters(); // Refresh the saved characters display
}

classSelect.addEventListener('change', () => {
    updateClassImage();
    updateHitPoints();
});


populateClassOptions();
populateRaceOptions();
createAbilityScoreDropdowns();

saveCharacterBtn.addEventListener('click', saveCharacter);
createCharacterBtn.addEventListener('click', createCharacter);
showSavedCharactersBtn.addEventListener('click', showSavedCharacters);
hideSavedCharactersBtn.addEventListener('click', hideSavedCharacters);
deleteCharacterBtn.addEventListener('click', deleteCharacter);

classSelect.addEventListener("change", updateHitPoints);
document.getElementById("score-constitution").addEventListener("change", updateHitPoints);

    