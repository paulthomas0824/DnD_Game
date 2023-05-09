const classSelect = document.getElementById('class-select');
const raceSelect = document.getElementById('race-select');
const abilityScoresDiv = document.getElementById('ability-scores');
const saveCharacterBtn = document.getElementById('save-character');
const createCharacterBtn = document.getElementById('create-character');
const showSavedCharactersBtn = document.getElementById('show-saved-characters');
const savedCharactersDiv = document.getElementById('saved-characters');
const hideSavedCharactersBtn = document.getElementById('hide-saved-characters');
const deleteCharacterBtn = document.getElementById('delete-character');

const classes = ['Class1', 'Class2', 'Class3']; // Add D&D classes here
const races = ['Race1', 'Race2', 'Race3']; // Add D&D races here
const abilityScores = ['Strength', 'Dexterity', 'Constitution', 'Intelligence', 'Wisdom', 'Charisma'];

function populateOptions(select, options) {
    options.forEach(option => {
        const opt = document.createElement('option');
        opt.value = option;
        opt.textContent = option;
        select.appendChild(opt);
    });
}

function createAbilityScoreInputs() {
    abilityScores.forEach(score => {
        const label = document.createElement('label');
        label.textContent = `${score}:`;

        const input = document.createElement('input');
        input.type = 'number';
        input.id = `score-${score.toLowerCase()}`;
        input.min = 0;
        input.max = 20;
        input.value = 0;

        abilityScoresDiv.appendChild(label);
        abilityScoresDiv.appendChild(input);
    });
}
const standardArray = [15, 14, 13, 12, 10, 8];

// ... other code ...

function createAbilityScoreDropdowns() {
    const abilityDescriptions = {
      Strength: "This ability represents a character's physical power, including their ability to lift heavy objects, break objects, or perform feats of athleticism.",
      Dexterity: "Dexterity represents a character's agility, balance, and reflexes, affecting actions that require quick, precise movements.",
      Constitution: "Constitution represents a character's health and stamina, determining their ability to endure challenges and recover from injury.",
      Intelligence: "Intelligence represents a character's mental capacity, including their ability to learn, reason, and solve problems.",
      Wisdom: "Wisdom represents a character's intuition, perception, and willpower, affecting their ability to assess situations and make sound judgments.",
      Charisma: "Charisma represents a character's force of personality, charm, and leadership abilities, influencing their ability to persuade, deceive, or inspire others."
    };
  
    


    abilityScores.forEach((score) => {
        const label = document.createElement("label");
        label.textContent = `${score}:`;
    
        const select = document.createElement("select");
        select.id = `score-${score.toLowerCase()}`;
  
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
      
      
  
      // Create a tooltip element
      const tooltip = document.createElement("span");
      tooltip.classList.add("tooltip");
      tooltip.textContent = abilityDescriptions[score]; // Actual ability info
  
      // Add the tooltip to the label
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
  }
  
  
  // ... other code ...

  function updateAbilityModifier(select) {
    const score = parseInt(select.value);
    const ability = select.id.split("-")[1];
    const modifierSpan = document.getElementById(`modifier-${ability}`);
    
    if (isNaN(score)) {
      modifierSpan.textContent = "";
      return;
    }
    
    const modifier = Math.floor((score - 10) / 2);
    modifierSpan.textContent = `${modifier >= 0 ? "+" : ""}${modifier}`; // Remove "Modifier: " from this line
  
    // Update Armor Class when Dexterity is changed
    if (ability === 'dexterity') {
      updateArmorClass(modifier);
    }
}
  
  function updateArmorClass(dexterityModifier) {
    const armorClassDiv = document.getElementById('armor-class');
    const baseAC = 10;
    const armorClass = baseAC + dexterityModifier;
    armorClassDiv.textContent = armorClass;
  }
  
  


  // A function to update the dropdown options when a selection is made
  function updateDropdowns() {
    // Loop through each ability score dropdown
    $('select.ability-score').each(function() {
      const ability = $(this).attr('data-ability');
      const selectedValue = currentSelections[ability];

      // Remove all options except the first (placeholder) option
      $(this).children('option:not(:first)').remove();

      // Add options back based on the standard array and the current selections
      const standardArray = [15, 14, 13, 12, 10, 8];
      standardArray.forEach(function(score) {
        if (!Object.values(currentSelections).includes(score) || score === selectedValue) {
          const option = $('<option>').val(score).text(score);
          if (score === selectedValue) {
            option.prop('selected', true);
          }
          $(this).append(option);
        }
      });
    });
  }


// ... other code ...




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

async function populateClassOptions() {
    const classes = await fetchClasses();
    populateOptions(classSelect, classes.map(c => c.name));
}

async function populateRaceOptions() {
    const races = await fetchRaces();
    populateOptions(raceSelect, races.map(r => r.name));
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
    classSelect.value = classes[0];
    raceSelect.value = races[0];

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
}

function hideSavedCharacters() {
    savedCharactersDiv.innerHTML = '';
}

function deleteCharacter() {
    const characters = JSON.parse(localStorage.getItem('characters')) || [];
    if (characters.length === 0) {
        alert('No saved characters to delete.');
        return;
    }

    const characterIndex = parseInt(prompt('Enter the character number (1-3) you want to delete:')) - 1;
    if (isNaN(characterIndex) || characterIndex < 0 || characterIndex >= characters.length) {
        alert('Invalid character number.');
        return;
    }

    characters.splice(characterIndex, 1);
    localStorage.setItem('characters', JSON.stringify(characters));
    alert('Character deleted.');
    showSavedCharacters();
}


async function init() {
    await Promise.all([populateClassOptions(), populateRaceOptions()]);
    saveCharacterBtn.addEventListener('click', saveCharacter);
    createCharacterBtn.addEventListener('click', createCharacter);
    showSavedCharactersBtn.addEventListener('click', showSavedCharacters);
    hideSavedCharactersBtn.addEventListener('click', hideSavedCharacters);
    deleteCharacterBtn.addEventListener('click', deleteCharacter);
    createAbilityScoreDropdowns();
}

// ... Your main.js code ...

// Add the ability_scores.js code below
$(document).ready(function() {
    // Initialize an object to store the current selections
    let currentSelections = {
      Strength: null,
      Dexterity: null,
      Constitution: null,
      Intelligence: null,
      Wisdom: null,
      Charisma: null
    };
  
  
  
    // Attach an event handler to each ability score dropdown
    $('select.ability-score').change(function() {
      const ability = $(this).attr('data-ability');
      const selectedValue = parseInt($(this).val());
  
      // Update the current selections object
      currentSelections[ability] = isNaN(selectedValue) ? null : selectedValue;
  
      // Update the dropdown options
      updateDropdowns();
    });
  
    // Initialize the dropdown options
    updateDropdowns();
});

init();