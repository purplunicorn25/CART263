"use strict";

/********************************************************************
Computational Wizard Duel
Anne Boutet
(✿◠‿◠)

Basic turn-by-turn based game of a computational wizard duel. There are
three types of actions spell, counterSpell, and items. The effects of
these actions affect the battery power (health power). The goal is to
bring the opponent battery power to zero. Some spells or items are in
a limited quantity so a bit a strategy might be needed.

*********************************************************************/

$(document).ready(setup);

//
const CHECK_INTERVAL = 10;

// Start value
let starting;

// Attacks, Counter-Attacks, and Items
let spells = [];
let counterSpells = [];
let items = [];
let wizards = [];

// Current used spell JSON Index
let activeActionIndex = 0;

// Spell Values
let damageAmount = 0;
let healAmount = 0;
let healed = false;
let critMultiplier = [1.5, 1.6, 1.7, 1.8];
let crit = false;

// Spell Type Status
let spell = false;
let counterSpell = false;
let item = false;

// Array containing all spells
let offensiveSpellBook = [];
let spellBook = [];
let defensiveSpellBook = [];

// Player and Opponent objects
// They start with full
let player = {
  hp: 100,
  name: "player",
  losing: false
}
let opponent = {
  hp: 100,
  name: "opponent",
  wizardName: "",
  spell: "",
  losing: false
}

// Sounds
let musicSFX = new Pizzicato.Sound({
  source: 'file',
  options: {
    path: './assets/sounds/CWD_inGame_Music.mp3',
    loop: true,
    volume: .2
  }
});
let magicSFX = new Pizzicato.Sound({
  source: 'file',
  options: {
    path: './assets/sounds/magic.wav',
    volume: .4,
  }
});

// setup
//
// Load the data from the JSON
function setup() {
  // Get the data from the JSON file
  $.getJSON("data/spells.json")
    .fail(dataError)
    .done(dataLoaded);
}

// dataError
//
// If the JSON file did not load correctly show an error
function dataError(request, textStatus, error) {
  // Display the error in the console
  console.error(error);
}

// dataLoaded
//
// Store the data in arrays, display the element that require the data,
// And start the game
function dataLoaded(data) {
  // Store the spells and the wizards in an array
  spells = data.spells;
  counterSpells = data.counterSpells;
  items = data.items;
  wizards = data.wizards;
  // Display the all spells in the dropdown menus
  displaySpells();
  // Create an array that stores all the effects
  createSpellBook();
  // Start game
  startGame();
}

// displaySpells
//
// Display the spells as buttons, the amount of spells left and info button
function displaySpells() {
  // For every spells make a button with the right ID, the spell's name, and an info bubble
  for (let i = 0; i < spells.length; i++) {
    $("#spellButtons").append(`<button class="spellsActions" id='${spells[i].id}'>${spells[i].name} (${spells[i].amount})<div class='content-info' id='infoS${i}'>&#9432;</div></button>`);
    $(`#infoS${i}`).append(`<div class="dropdown-info">${spells[i].effects}</div>`);
  }
  // For every counter-spells make a button with the right ID, the counter-spell's name, and an info bubble
  for (let i = 0; i < counterSpells.length; i++) {
    $("#counterSpellButtons").append(`<button class="counterSpellsActions" id='${counterSpells[i].id}'>${counterSpells[i].name} (${counterSpells[i].amount})<div class='content-info' id='infoCS${i}'>&#9432;</div></button>`);
    $(`#infoCS${i}`).append(`<div class="dropdown-info">${counterSpells[i].effects}</div>`);
  }
  // For every items make a button with the right ID, the item's name, and an info bubble
  for (let i = 0; i < items.length; i++) {
    $("#itemButtons").append(`<button class="itemsActions" id='${items[i].id}'>${items[i].name} (${items[i].amount})<div class='content-info' id='infoI${i}'>&#9432;</div></button>`);
    $(`#infoI${i}`).append(`<div class="dropdown-info">${items[i].effects}</div>`);
  }
  // Turn them all into jquery buttons (Turning them after keep the CSS of the dropdown menu)
  $(".spellsActions").button();
  $(".counterSpellsActions").button();
  $(".itemsActions").button();
}

// startGame
//
// Set the basic updating elements and the random draw button
function startGame() {
  // Define who is the opponent
  opponent.wizardName = getRandomElement(wizards);
  // Display the instructions
  $("#instructions").text(`Challenge your wizard skills against the great wizard ${opponent.wizardName}. In this duel, you have to choose only one spell, counter-spell, or an item per turn,
    and some are in a limited quantity. The goal is, like in every duel, to defeat your opponent and bring defamation to the name of ${opponent.wizardName}. Choose your side and be victorious!`);
  // Display the opponent's name
  $("#opponentName").html(`${opponent.wizardName}`);
  // Draw to find out who starts the game
  $("#draw").click(flicker);
  //  Display battery power (HP)
  updateBatteryPower();
  // Always check if spells amount more then 0
  setInterval(checkSpellAmount, CHECK_INTERVAL);
  // Always check if HP is over 100
  setInterval(checkHP, CHECK_INTERVAL);
}

// flicker
//
// Animation effect for the random draw
function flicker() {
  // Pulsate the white box, displaying the black box under
  $("#whiteBox").effect('pulsate', 'linear', 800, chooseFirstPlayer);
  // Hide the button so the user can only draw once
  $("#draw").hide();
}

// chooseFirstPlayer
//
// Decide who starts first with a random draw
function chooseFirstPlayer() {
  // Hide the two boxes at the end of flicker
  $("#whiteBox").hide();
  $("#blackBox").hide();
  // Value of the random result
  let result;
  // Define a random number
  let randomNumber = Math.random();
  // Depending on the random number, display the right box to
  // indicate to the user the result
  if (randomNumber < 0.5) {
    $("#whiteBox").show();
    result = "white";
  } else if (randomNumber > 0.5) {
    $("#blackBox").show();
    result = "black";
  }
  // Check if the result is the same as the selected side
  // Start the game with the right player/opponent first
  if ($("#side :selected").val() === result) {
    // Display who starts
    $("#drawResult").text("YOU START!");
    // Start with the player round
    starting = player;
    // Call the pre-duel instructions
    setTimeout(beginDuel, 1500);
  } else {
    // Display who starts
    $("#drawResult").text(`${opponent.wizardName} STARTS...`);
    // Start with the opponent round
    starting = opponent;
    // Call the pre-duel instructions
    setTimeout(beginDuel, 1500);
  }
}

// beginDuel
//
// Go through the steps of starting a wizard duel
// (with timing for dialog-like feeling)
// And start the game
function beginDuel() {
  // First line of text
  $("#prepare").append(`<h2>PREPARE TO DUEL</h2><p>Show respect to ${opponent.wizardName}.</p>`);
  // Display the buttons with a delay, respect or disrespect
  setTimeout(() => {
    $(".bow").css("display", "inline-block");
  }, 1500);
  // On click, bring the next line of text
  $(".bow").click(() => {
    // Hide the buttons
    $(".bow").hide();
    // Add the text to the next step
    $("#ready").text("Ready your keyboard...");
    // After a short while, display the start button
    setTimeout(() => {
      $(".start").css("display", "inline-block");
    }, 2000);
  });
  // On click, hide the start menu to reveal the player command board
  $(".start").one("click", () => {
    // Play the game music in a loop
    musicSFX.play();
    // Hide the menu
    $("#startMenu").hide();
    // Start the round of the starting agent
    if (starting.name === "player") {
      enableActions();
      playerRound();
    } else if (starting.name === "opponent") {
      disableActions();
      opponentRound();
    }
  })
}

// playerRound
//
// Choose an actions in the command board
function playerRound() {
  // All possible actions do similar effects
  // The player can only select one before all others are disabled
  // architecture of applySpell -> (spellIndex, actions, isSpell, isCounterSpell, isItem)

  // SPELLS
  // Unplug deals damage (unlimited)
  $("#unplug").one("click", (event) => {
    applySpell(0, [{
      function: dealDamage,
      agent: opponent
    }], true, false, false);
    // Prevents effects to double
    event.stopImmediatePropagation();
  });
  // Saturate deals damage with chance of critical strike (limited)
  $("#saturate").one("click", (event) => {
    applySpell(1, [{
      function: criticalDamage,
      agent: opponent
    }, {
      function: reduceSpellAmount,
      agent: player
    }], true, false, false);
    // Prevents effects to double
    event.stopImmediatePropagation();
  });

  // COUNTERSPELLS
  // Deals damage and heals twice the damage amount
  $("#antivirus").one("click", (event) => {
    applySpell(0, [{
      function: dealDamage,
      agent: opponent
    }, {
      function: heal,
      agent: player
    }, {
      function: reduceSpellAmount,
      agent: player
    }], false, true, false);
    // Prevents effects to double
    event.stopImmediatePropagation();
  });

  // ITEMS
  // Generator give battery power
  $("#generator").one("click", (event) => {
    applySpell(0, [{
      function: heal,
      agent: player
    }], false, false, true);
    // Prevents effects to double
    event.stopImmediatePropagation();
  });
}

// applySpell
//
// A function that manages every spell, its possible effects, and the recap type
function applySpell(spellIndex, effects, isSpell, isCounterSpell, isItem) {
  // Play a sound
  magicSFX.play();
  // Define the spell type
  spell = isSpell;
  counterSpell = isCounterSpell;
  item = isItem;
  // Define the right index for the spells
  activeActionIndex = spellIndex;
  // Disable all the buttons
  disableActions();
  // Apply all the according actions
  for (let i = 0; i < effects.length; i++) {
    effects[i].function(effects[i].agent);
  }
  // Start the opponent's round
  setTimeout(endPlayerRound, 1000);
}

// endPlayerRound
//
// Display action recap and start next round
function endPlayerRound() {
  // Display the most recent action in the match history
  history(player);
  // Do not start another opponent round if the opponent lost
  if (opponent.losing === false) {
    // Start the opponent round with a somewhat random delay so its not immediate
    setTimeout(opponentRound, Math.random() * 5000);
  }
}

// opponentRound
//
// Apply a random spell from the spellBook
function opponentRound() {
  // Choose different spell books according to the battery level of the agents
  if (opponent.hp > 70) {
    // Choose a random spell in the offensiveSpellBook
    opponent.spell = getRandomElement(offensiveSpellBook);
  } else if (opponent.hp <= 70 && opponent.hp >= 10) {
    // Choose a random spell in the offensiveSpellBook
    opponent.spell = getRandomElement(spellBook);
  } else if (player.hp < 20) {
    opponent.spell = getRandomElement(offensiveSpellBook);
  } else if (opponent.hp < 10) {
    // Choose a random spell in the offensiveSpellBook
    opponent.spell = getRandomElement(defensiveSpellBook);
  }
  // Define the recap text type
  spell = opponent.spell.isSpell;
  counterSpell = opponent.spell.isCounterSpell;
  item = opponent.spell.isItem;
  // Set the correct index
  activeActionIndex = opponent.spell.jsonIndex;
  // Apply its effects
  for (let i = 0; i < opponent.spell.effects.length; i++) {
    opponent.spell.effects[i].function(opponent.spell.effects[i].agent);
  }
  // End the opponent round
  setTimeout(endOpponentRound, 1000);
}

// endOpponentRound
//
// Display action recap and start next round
function endOpponentRound() {
  // Display the most recent action in the match history
  history(opponent);
  // Enable the player to select its next action and start its round
  setTimeout(enableActions, 1000);
  setTimeout(playerRound, 1000);
}

// checkHP
//
// Check if the HP is over 100 or below 0
// Constrain it under 100 and at 0 call endgame
function checkHP() {
  // Always keep sure that the HP are only displayed with one digit
  opponent.hp = parseFloat(opponent.hp).toFixed(1);
  player.hp = parseFloat(player.hp).toFixed(1);
  // Stop checking HP when the game is over
  if (player.losing === false && opponent.losing === false) {
    // PLAYER
    // The player restaured all his HP
    if (player.hp > 100) {
      // Make it so it does not go over 100
      player.hp = 100;
      // The player has no battery power
    } else if (player.hp <= 0) {
      // Make it so it does not go below 0
      player.hp = 0;
      // player losing is true
      player.losing = true;
      // The player lost
      endgame();
    }
    // OPPONENT
    // The opponent restaured all his HP
    if (opponent.hp > 100) {
      // Make it so it does not go over 100
      opponent.hp = 100;
      // The opponent has no battery power
    } else if (opponent.hp <= 0) {
      // Make it so it does not go below 0
      opponent.hp = 0;
      // Opponent losing is true
      opponent.losing = true;
      // The opponent lost
      endgame();
    }
  }
  // Apply the change
  updateBatteryPower();
}

// disableActions
//
// Disable the player's action buttons
function disableActions() {
  // Disable every section seperatly
  $(".spellsActions").button("disable");
  $(".counterSpellsActions").button("disable");
  $(".itemsActions").button("disable");
}

// enableActions
//
// Enable the player's action buttons
function enableActions() {
  // Enable every section seperatly
  $(".spellsActions").button("enable");
  $(".counterSpellsActions").button("enable");
  $(".itemsActions").button("enable");
}

// history
//
// Display the most recent action
function history(agent) {
  // Always keep sure that the damage and heal amount are display with one digit
  damageAmount = parseFloat(damageAmount).toFixed(1);
  healAmount = parseFloat(healAmount).toFixed(1);
  // Define who caused the action
  let initiator = agent.name;
  // Define approprite pronoun/noun/article
  let sender;
  let receiver;
  // If the player initiated the action
  if (initiator === "player") {
    sender = "YOU";
    receiver = `${opponent.wizardName}`;
  } else if (initiator === "opponent") {
    sender = `${opponent.wizardName}`;
    receiver = "YOU";
  }
  // The value containing the text to display
  let actionSummary;
  // FOR SPELLS
  if (spell === true) {
    // Critical damage action
    if (crit === true) {
      // Define text
      actionSummary = `*CRITICAL DAMAGE* ${sender} used ${spells[activeActionIndex].name} and ${receiver} lost ${damageAmount}% of battery power.`;
      // Return the condition to false
      crit = false;
    }
    // Regular damage action
    else {
      // Define text
      actionSummary = `${sender} used ${spells[activeActionIndex].name} and ${receiver} lost ${damageAmount}% of battery power.`;
    }
    // FOR COUNTERSPELLS
  } else if (counterSpell === true) {
    // Define text
    actionSummary = `${sender} used ${counterSpells[activeActionIndex].name}. ${sender} generated ${healAmount}% of battery power while ${receiver} lost ${damageAmount}% of battery power.`;
    // FOR ITEMS
  } else if (item === true) {
    // Healing action
    if (healed === true) {
      // Define text
      actionSummary = `${sender} used ${items[activeActionIndex].name} and generated ${healAmount}% of battery power.`;
      // Return the condition to false
      healed = false;
    }
  }
  // Display the action recap in the match history
  $("#recap").append(`<p>${actionSummary}</p>`);
  // Adjust the overflow to see what was just added without scrolling
  updateScroll();
  // Everything returns to false
  spell = false;
  counterSpell = false;
  item = false;
}

// updateScroll
//
// Show the last added action recap
function updateScroll() {
  // Scroll to the bottom of the recap div
  let log = document.getElementById("recap");
  log.scrollTop = log.scrollHeight;
}

// updateBatteryPower
//
// Display the player and opponent battery power, update after events
function updateBatteryPower() {
  // Display player's HP in the log
  $("#hp").text(`BATTERY POWER: ${player.hp}%`);
  // Display player's HP below the life bar
  $("#playerLifeBarText").text(`BATTERY POWER: ${player.hp}%`);
  // Adjust the width of the life bar accordingly
  $("#playerLife").css("width", `${player.hp}%`);
  // Display opponent's HP below the life bar
  $("#opponentLifeBarText").text(`BATTERY POWER: ${opponent.hp}%`);
  // Adjust the width of the life bar accordingly
  $("#opponentLife").css("width", `${opponent.hp}%`);
}

// checkSpellAmount
//
// Check of the spell is still available, if not disable the button
function checkSpellAmount() {
  // FOR PLAYER -> Check if it's amount is equal to 0
  for (let i = 0; i < spells.length; i++) {
    if (spells[i].amount === 0) {
      // Disable the according button
      $(`#${spells[i].id}`).button("disable");
    }
  }
  for (let i = 0; i < counterSpells.length; i++) {
    if (counterSpells[i].amount === 0) {
      // Disable the according button
      $(`#${counterSpells[i].id}`).button("disable");
    }
  }
  for (let i = 0; i < items.length; i++) {
    if (items[i].amount === 0) {
      // Disable the according button
      $(`#${items[i].id}`).button("disable");
    }
  }
  // FOR OPPONENT -> Check if it's amount is equal to 0
  if (opponent.spell.amount === 0) {}
}

// getRandomElement
//
// Get a random element from a specific array
function getRandomElement(array) {
  let element = array[Math.floor(Math.random() * array.length)];
  return element;
}
// endgame
//
// The agent is the one that lost
function endgame() {
  // Stop the music
  musicSFX.stop();
  // If player lost display this screen
  if (player.losing === true) {
    playerLoser();
    // If opponent lost display this screen
  } else if (opponent.losing === true) {
    opponentLoser();
  }
}

// playerLoser
//
// Display the loser screen
function playerLoser() {
  // Show losing and closed screen behind
  $("#endGameLoser").show();
  $("#blackScreen").show();
  // Hide the screen after 10 seconds
  let seconds = 10;
  // Make a countdown before the screen disapear
  setInterval(() => {
    // Remove 1
    seconds -= 1;
    // Display the timer
    $("#timer").html(`<p><h2>your device will shut down in </h2><h1>${seconds}</h1></p>`);
    // When the countdown is over hide the end
    if (seconds === 0) {
      // Hide the text
      $("#endGameLoser").hide("scale", "fast");
    }
  }, 1000);
  // If restart button is clicked restart the game
  $("#startAgainDark").one("click", restartGame);
}

// opponentLoser
//
// Display the winning screen
function opponentLoser() {
  // Show winning screen
  $("#endGameWinner").show();
  // If restart button is clicked restart the game
  $("#startAgain").one("click", restartGame);
}

// restartGame
//
// Restaure the values of to their initial state
function restartGame() {
  // Hide all the endgame screens
  $("#endGameWinner").hide();
  $("#endGameLoser").hide();
  $("#blackScreen").hide();
  // Show the startMenu
  $("#startMenu").show();
  // Restore the draw menu
  // Define who is the new opponent
  opponent.wizardName = getRandomElement(wizards);
  // Display the instructions with the right opponent
  $("#instructions").text(`Challenge your wizard skills against the great wizard ${opponent.wizardName}. In this duel, you have to choose only one spell, counter-spell, or an item per turn,
    and some are in a limited quantity. The goal is, like in every duel, to defeat your opponent and bring defamation to the name of ${opponent.wizardName}. Choose your side and be victorious!`);
  // Display the new opponent's name
  $("#opponentName").html(`${opponent.wizardName}`);
  // Make these element back to their original state
  $("#drawResult").empty();
  $("#prepare").empty();
  $("#ready").empty();
  $(".start").css("display", "none");
  $("#draw").show();
  // Empty the recap and restore the agent's HP to 100
  $("#recap").empty();
  player.hp = 100;
  opponent.hp = 100;
  // Enable checkHP again
  player.losing = false;
  opponent.losing = false;
  starting = "";
  // Restore the spell, counter-spell, and item amounts
  // For the player
  for (let i = 0; i < spells.length; i++) {
    spells[i].amount = spells[i].initialAmount;
  }
  for (let i = 0; i < counterSpells.length; i++) {
    counterSpells[i].amount = counterSpells[i].initialAmount;
  }
  for (let i = 0; i < items.length; i++) {
    items[i].amount = items[i].initialAmount;
  }
  // For the opponent
  for (let i = 0; i < spellBook.length; i++) {
    spellBook[i].amount = spellBook[i].initialAmount;
  }
}

//
//
// SPELLS, COUNTERSPELLS & ITEMS
//
//

// createSpellBooks
//
// An array in which all the spells are stored
// Only used by opponent to get a random spell in its turn
function createSpellBook() {
  // Create a spell object for every spell
  spellBook = [{
      // UNPLUG
      jsonIndex: 0,
      id: spells[0].id,
      name: spells[0].name,
      points: spells[0].points,
      effects: [{
        function: dealDamage,
        agent: player
      }],
      initialAmount: spells[0].initialAmount,
      amount: spells[0].amount,
      isSpell: true,
      isCounterSpell: false,
      isItem: false
    },
    {
      // SATURATE
      jsonIndex: 1,
      id: spells[1].id,
      name: spells[1].name,
      points: spells[1].points,
      effects: [{
        function: criticalDamage,
        agent: player
      }, {
        function: reduceSpellAmount,
        agent: opponent
      }],
      initialAmount: spells[1].initialAmount,
      amount: spells[1].amount,
      isSpell: true,
      isCounterSpell: false,
      isItem: false
    },
    // ANTIVIRUS
    {
      jsonIndex: 0,
      id: counterSpells[0].id,
      name: counterSpells[0].name,
      points: counterSpells[0].points,
      effects: [{
        function: dealDamage,
        agent: player
      }, {
        function: heal,
        agent: opponent
      }, {
        function: reduceSpellAmount,
        agent: opponent
      }],
      initialAmount: counterSpells[0].initialAmount,
      amount: counterSpells[0].amount,
      isSpell: false,
      isCounterSpell: true,
      isItem: false
    },
    // GENERATOR
    {
      jsonIndex: 0,
      id: items[0].id,
      name: items[0].name,
      points: items[0].points,
      effects: [{
        function: heal,
        agent: opponent
      }],
      initialAmount: items[0].initialAmount,
      amount: items[0].amount,
      isSpell: false,
      isCounterSpell: false,
      isItem: true
    }
  ];
  // More specific spellBooks
  // For damage spells
  offensiveSpellBook = [spellBook[0], spellBook[1]];
  // For healing spells
  defensiveSpellBook = [spellBook[2], spellBook[3]];
}

// reduceSpellAmount
//
// Remove 1 to the used spell amount
function reduceSpellAmount(agent) {
  // Check whose spell to reduce
  if (agent.name === "player") {
    // Reduce one to the amount
    if (spell === true) {
      spells[activeActionIndex].amount -= 1;
      // Change the text of the button
      // Requires to append the info button again
      $(`#${spells[activeActionIndex].id}`).text(`${spells[activeActionIndex].name} (${spells[activeActionIndex].amount})`);
      $(`#${spells[activeActionIndex].id}`).append(`<div class='content-info' id='infoS${activeActionIndex}'>&#9432;</div>`)
      $(`#infoS${activeActionIndex}`).append(`<div class="dropdown-info">${spells[activeActionIndex].effects}</div>`);
    }
    if (counterSpell === true) {
      counterSpells[activeActionIndex].amount -= 1;
      // Change the text of the button
      // Requires to append the info button again
      $(`#${counterSpells[activeActionIndex].id}`).text(`${counterSpells[activeActionIndex].name} (${counterSpells[activeActionIndex].amount})`);
      $(`#${counterSpells[activeActionIndex].id}`).append(`<div class='content-info' id='infoCS${activeActionIndex}'>&#9432;</div>`)
      $(`#infoCS${activeActionIndex}`).append(`<div class="dropdown-info">${counterSpells[activeActionIndex].effects}</div>`);
    }
    if (items === true) {
      items[activeActionIndex].amount -= 1;
      // Change the text of the button
      // Requires to append the info button again
      $(`#${items[activeActionIndex].id}`).text(`${items[activeActionIndex].name} (${items[activeActionIndex].amount})`);
      $(`#${items[activeActionIndex].id}`).append(`<div class='content-info' id='infoI${activeActionIndex}'>&#9432;</div>`)
      $(`#infoI${activeActionIndex}`).append(`<div class="dropdown-info">${items[activeActionIndex].effects}</div>`);
    }
  }
  if (agent.name === "opponent") {
    // Reduce one to the amount
    opponent.spell.amount -= 1;
  }
}

// SPELLS
// dealDamage
//
// Deal damage to the opposing wizard
function dealDamage(agent) {
  // Define the spell's damage
  damageAmount = getRandomElement(spells[activeActionIndex].points);
  // Apply the damage
  agent.hp -= damageAmount;
  // Update the battery power of both wizards
  updateBatteryPower();
  // Animate the life bar text of the agent
  $(`#${agent.name}LifeBarText`).effect('pulsate');
}

// criticalDamage
//
// Chance of critical damage, if not regular damage is applied
function criticalDamage(agent) {
  // Define a random number
  let randomNumber = Math.random();
  // If the random number is smaller
  if (randomNumber < spells[activeActionIndex].criticalChance) {
    // Deal the spell damage multiplied by the random critMultiplier value
    damageAmount = getRandomElement(spells[activeActionIndex].points) * getRandomElement(critMultiplier);
    damageAmount = damageAmount;
    // Apply the damage to the opponent
    agent.hp -= damageAmount;
    // For the action recap crit is true
    crit = true;
  } else {
    // Deal the spell damage
    damageAmount = getRandomElement(spells[activeActionIndex].points);
    damageAmount = damageAmount;
    // Apply the damage to the opponent
    agent.hp -= damageAmount;
  }
  // Update the battery power of both wizards
  updateBatteryPower();
  // Animate the life bar text of the agent
  $(`#${agent.name}LifeBarText`).effect('pulsate');
}

// ITEMS
// heal
//
// Increase the agent's battery power
function heal(agent) {
  // For counterspells
  if (counterSpell === true) {
    // For antivirus
    if (counterSpells[activeActionIndex].antivirus === true) {
      healAmount = damageAmount * counterSpells[activeActionIndex].healthMultiplier;
    }
  } else if (item === true) {
    // Define spell's healing
    healAmount = getRandomElement(items[activeActionIndex].points);
  }
  // Apply healing
  agent.hp += healAmount;
  // Update the battery power of both wizards
  updateBatteryPower();
  // Animate the life bar text of the player
  $(`#${agent.hp}LifeBarText`).effect('pulsate');
  // For action recap
  healed = true;
}