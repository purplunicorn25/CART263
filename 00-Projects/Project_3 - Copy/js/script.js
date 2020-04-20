$(document).ready(setup);

//
const CHECK_INTERVAL = 1;

// Attacks, Counter-Attacks, and Items
let spells;
let counterSpells = [];
let items = [];

// Current used spell JSON Index
let activeActionIndex = 0;

// Spell Values
let damageAmount;
let healAmount;
let healed = false;
let critMultiplier = [1.5, 1.6, 1.7, 1.8];
let crit = false;

// Spell Type Status
let spell = false;
let counterspell = false;
let item = false;

// Player and Opponent objects
// They start with full
let player = {
  hp: 100,
  name: "player"
}
let opponent = {
  hp: 100,
  name: "opponent"
}

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
  // Store the spells in an array
  spells = data.spells;
  counterSpells = data.counterSpells;
  items = data.items;
  // Display the all spells in the dropdown menus
  displaySpells();
  // Start game
  startGame();
}


// displaySpells
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
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
  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  playerRound();
}

// startGame
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1
// Set the basic updating elements and the random draw button
function startGame() {
  // Draw to find out who starts the game
  $("#draw").click(flicker);
  //  Display battery power (HP)
  updateBatteryPower();
  // Always check if spells amount more then 0
  setInterval(checkSpellAmount, CHECK_INTERVAL);
  // Always check if HP is over 100
  setInterval(checkHP, CHECK_INTERVAL);
  //////////////////////////////////////////////
  $("#startMenu").hide();
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
    // Start the player round
    playerRound();
    // Call the pre-duel instructions
    setTimeout(beginDuel, 1500);
  } else {
    // Display who starts
    $("#drawResult").text("YOUR OPPONENT STARTS...");
    // Start the opponent round
    opponentRound();
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
  $("#prepare").append("<h2>PREPARE TO DUEL</h2><p>Show respect to your opponent.</p>");
  // Display the buttons with a delay, respect or disrespect
  setTimeout(() => {
    $(".bow").css("display", "inline-block");
  }, 1500);
  // On click, bring the next line of text
  $(".bow").click(() => {
    $("#ready").append("<p>Ready your keyboard...<br>");
    // After a short while, display the start button
    setTimeout(() => {
      $(".start").css("display", "inline-block");
    }, 2000);
  });
  // On click, hide the start menu to reveal the player command board
  $(".start").click(() => {
    $("#startMenu").hide();
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
  $("#unplug").one("click", () => {
    applySpell(0, [dealDamage(opponent)], true, false, false)
  });
}

// applySpell
//
// A function that manages every spell, its possible effects, and the recap type
function applySpell(spellIndex, actions, isSpell, isCounterSpell, isItem) {
  // Define the right index for the spells
  activeActionIndex = spellIndex;
  // Disable all the buttons
  disableActions();
  // Apply all the according actions
  for (let i = 0; i < actions.length; i++) {
    actions[i];
  }
  // Start the opponent's round
  setTimeout(endPlayerRound, 1000);
  // Define the recap text type
  spell = isSpell;
  counterspell = isCounterSpell;
  items = isItem;
}

// endPlayerRound
//
//
function endPlayerRound() {
  //
  history(player);
  //
  damageAmount = 0;
  healAmount = 0;
  //
  opponentRound();
}

// opponentRound
//

function opponentRound() {
  console.log("opponent");
  // opponentHP = 100;
  // updateBatteryPower();
  setTimeout(endOpponentRound, 1000);
}

// endOpponentRound
// ??????????????????????????????????????????????????????????????????????????????????????
// Whenever I call playerRound again the function doubles...
function endOpponentRound() {
  playerRound();
  // USE TO BE AT THE START OF THE PLAYERROUND !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  // Enable the player to select its next action
  setTimeout(enableActions, 1000);
}

// endgame
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// The agent is the one that lost
function endgame(agent) {
  let loser = agent;
  console.log(loser.name + " lost")
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
  // Define who caused the action
  let initiator = agent.name;
  // Define approprite pronoun/noun/article
  let sender;
  let receiver;
  // If the player initiated the action
  if (initiator === "player") {
    sender = "YOU";
    receiver = "your OPPONENT";
  } else if (initiator === "opponent") {
    sender = "Your OPPONENT";
    receiver = "YOU";
  }
  // The value containing the text to display
  let actionSummary;
  // FOR SPELLS
  if (spell === true) {
    // Critical damage action
    if (crit === true) {
      actionSummary = `*CRITICAL DAMAGE* ${sender} used ${spells[activeActionIndex].name} and ${receiver} lost ${damageAmount}% of battery power.`;
      crit = false;
    }
    // Regular damage action
    else {
      actionSummary = `${sender} have used ${spells[activeActionIndex].name} and ${receiver} lost ${damageAmount}% of battery power.`;
    }
  } else if (counterspell === true) {

  } else if (item === true) {
    if (healed)
      actionSummary = `${sender} have used ${items[activeActionIndex].name} and generated ${healAmount}% of battery power.`;
  }
  // Display the action recap in the match history
  $("#recap").append(`<p>${actionSummary}</p>`);
  // Adjust the overflow to see what was just added without scrolling
  updateScroll();
  // Everything returns to false
  spell = false;
  counterspell = false;
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
  // Check if it's amount is equal to 0
  if (spells[activeActionIndex].amount < 0) {
    // Disable the according button
    $(`#${spells[activeActionIndex].id}`).button("disable");
  }
}

// checkHP
//
// Check if the HP is over 100 or below 0
// Constrain it under 100 and at 0 call endgame
function checkHP() {
  // PLAYER
  // The player restaured all his HP
  if (player.hp > 100) {
    // Make it so it does not go over 100
    player.hp = 100;
    // The player has no battery power
  } else if (player.hp < 0) {
    // Make it so it does not go below 0
    player.hp = 0;
    // The player lost
    endgame(player);
  }
  // OPPONENT
  // The opponent restaured all his HP
  if (opponent.hp > 100) {
    // Make it so it does not go over 100
    opponent.hp = 100;
    // The opponent has no battery power
  } else if (opponent.hp < 0) {
    // Make it so it does not go below 0
    opponent.hp = 0;
    // The opponent lost
    endgame(opponent);
  }
  // Apply the change
  updateBatteryPower();
}

// getRandomElement
//
// Get a random element from a specific array
function getRandomElement(array) {
  let element = array[Math.floor(Math.random() * array.length)];
  return element;
}

// SPELLS, COUNTERSPELLS & ITEMS

// reduceSpellAmount
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// Remove 1 to the used spell amount
function reduceSpellAmount() {
  // Reduce one to the amount
  spells[activeActionIndex].amount -= 1;
  // Change the text of the button
  $(`#${spells[activeActionIndex].id}`).text(`${spells[activeActionIndex].name} (${spells[activeActionIndex].amount})`);
}

// SPELLS
// dealDamage
//
//
function dealDamage(agent) {
  // Define the spell's damage
  damageAmount = getRandomElement(spells[activeActionIndex].points);
  // Apply the damage
  agent.hp -= damageAmount.toFixed(1);
  // Update the battery power of both wizards
  updateBatteryPower();
  // Animate the life bar text of the opponent
  $("#opponentLifeBarText").effect('pulsate');
}

// criticalDamage
// ????????????????????????????????????????????????????????
// Chance of critical damage, if not regular damage is applied
function criticalDamage() {
  // Define a random number
  let randomNumber = Math.random();
  // If the random number is smaller
  if (randomNumber < spells[activeActionIndex].criticalChance) {
    // Deal the spell damage multiplied by the random critMultiplier value
    damageAmount = getRandomElement(spells[activeActionIndex].points) * getRandomElement(critMultiplier);
    console.log(damageAmount);
    // Apply the damage to the opponent
    opponentHP -= damageAmount;
    opponentHP = opponentHP.toFixed(1);
    // For the action recap, crit is true
    crit = true;
  } else {
    // Deal the spell damage
    damageAmount = getRandomElement(spells[activeActionIndex].points);
    // Apply the damage to the opponent
    opponentHP -= damageAmount;
  }
  // Update the battery power of both wizards
  updateBatteryPower();
  // Animate the life bar text of the opponent
  $("#opponent1LifeBarText").effect('pulsate');
}

// ITEMS
// heal
// !!!!!!!!!!!!!!!!!!!
//
function heal() {
  // Define spell's healing
  healAmount = getRandomElement(items[activeActionIndex].healPoints);
  // Apply healing
  playerHP += healAmount;
  // For the action recap, healed is true
  healed = true;
  // Update the battery power of both wizards
  updateBatteryPower();
  // Animate the life bar text of the player
  $("#player1LifeBarText").effect('pulsate');
}