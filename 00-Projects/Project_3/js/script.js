"use strict";

/********************************************************************
Computational Wizard Duel
Anne Boutet
(✿◠‿◠)

DESCRIPTION!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

*********************************************************************/

$(document).ready(setup);

// Attacks, Counter-Attacks, and Items
let spells;
let counterSpells = [];
let items = [];

//
let activeActionIndex = 0;

//
let damageAmount;
let critMultiplier = [1.5, 1.6, 1.7, 1.8];
let crit = false;

// Life of player and opponent in terms of battery level (HP)
let playerHP = 100;
let opponentHP = 100;

// setup
//
//
function setup() {
  // Get the data from the JSON file
  $.getJSON("data/spells.json")
    .done(dataLoaded)
    .fail(dataError);
  // Draw to find out who starts the game
  $("#draw").click(flicker);
  // Display battery power (HP)
  updateBatteryPower();
  // Always check if spells amount more then 0
  setInterval(checkSpellAmount, 100);
  //////////////////////////////////////////////
  $("#startMenu").hide();
}

// dataLoaded
//
//
function dataLoaded(data) {
  // Store the spells in an array
  spells = data.spells;
  counterSpells = data.counterSpells;
  items = data.items;
  // Display the all spells in the dropdown menus
  displaySpells();
}

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
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
  // !!!!!!! COULD BE DONE JUST WITH JQUERY SINCE NOW THE CSS IS WORKING OKAY WITH JQUERY BUTTONS !!!!!!!!!!!!
  // Turn them all into jquery buttons
  $(".spellsActions").button();
  $(".counterSpellsActions").button();
  $(".itemsActions").button();
  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  playerRound();
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
//
function playerRound() {
  // Enable the player to select its next action
  enableActions();
  // All possible actions do similar effects
  // The player can only select one before all others are disabled

  // INDEX 0
  $("#unplug").click(() => {
    // Set the according index
    activeActionIndex = 0;
    // Once pressed disable all buttons
    // disableActions();
    // ACTIONS ->
    dealDamage();
    // End player round
    setTimeout(endPlayerRound, 1000);
  });

  // INDEX 1
  $("#saturate").click(() => {
    // Set the according index
    activeActionIndex = 1;
    // Reduce the spell amount by 1
    reduceSpellAmount();
    // Once pressed disable all buttons
    // disableActions();
    // ACTIONS ->
    criticalDamage();
    // End player round
    setTimeout(endPlayerRound, 1000);
  });
  //
  $("#control").click(control);
}

//
//
//
function endPlayerRound() {
  playerHistory();
  //
  damageAmount = 0;
  //
  opponentRound();
}

// dealDamage
//
//
function dealDamage() {
  // Deal the spell damage
  damageAmount = getRandomElement(spells[activeActionIndex].points);
  // Apply the damage to the opponent
  opponentHP -= damageAmount;
  // Update the battery power of both wizards
  updateBatteryPower();
  // Animate the life bar text of the opponent
  $("#opponent1LifeBarText").effect('pulsate');
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
    // Apply the damage to the opponent
    opponentHP -= damageAmount;
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

// control
//
//
function control() {
  console.log("control");
}

//
//
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
  // playerRound();
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

// reduceSpellAmount
//
// Remove 1 to the used spell amount
function reduceSpellAmount() {
  // Reduce one to the amount
  spells[activeActionIndex].amount -= 1;
  // Change the text of the button
  $(`#${spells[activeActionIndex].id}`).text(`${spells[activeActionIndex].name} (${spells[activeActionIndex].amount})`);
}

// checkSpellAmount
//
// Check of the spell is still available, if not disable the button
function checkSpellAmount() {
  // Check if it's amount is equal to 0
  if (spells[activeActionIndex].amount === 0) {
    // Disable the according button
    $(`#${spells[activeActionIndex].id}`).button("disable");
  }
}

// history
//
// Display the most recent action
function playerHistory() {
  //
  let actionSummary;
  // Critical damage action
  if (crit === true) {
    actionSummary = `*CRITICAL DAMAGE* YOU have used ${spells[activeActionIndex].name} and your OPPONENT lost ${damageAmount}% of its battery power.`;
    crit = false;
  }
  // Regular damage action
  else {
    actionSummary = `YOU have used ${spells[activeActionIndex].name} and your OPPONENT lost ${damageAmount}% of its battery power.`;
  }
  // Display the action recap in the match history
  $("#recap").append(`<p>${actionSummary}</p>`);
  // Adjust the overflow to see what was just added without scrolling
  updateScroll();
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
  $("#hp").text(`BATTERY POWER: ${playerHP}%`);
  // Display player's HP below the life bar
  $("#player1LifeBarText").text(`BATTERY POWER: ${playerHP}%`);
  // Adjust the width of the life bar accordingly
  $("#player1Life").css("width", `${playerHP}%`);
  // Display opponent's HP below the life bar
  $("#opponent1LifeBarText").text(`BATTERY POWER: ${opponentHP}%`);
  // Adjust the width of the life bar accordingly
  $("#opponent1Life").css("width", `${opponentHP}%`);
}

// dataError
//
// If the JSON file did not load correctly show an error
function dataError(request, textStatus, error) {
  // Display the error in the console
  console.error(error);
}

// getRandomElement
//
// Get a random element from a specific array
function getRandomElement(array) {
  let element = array[Math.floor(Math.random() * array.length)];
  return element;
}