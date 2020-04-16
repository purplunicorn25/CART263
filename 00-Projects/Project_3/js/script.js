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
let actionIndex = 0;

//
let damageAmount;

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
  player1round();
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
    player1round();
    // Call the pre-duel instructions
    setTimeout(beginDuel, 1500);
  } else {
    // Display who starts
    $("#drawResult").text("YOUR OPPONENT STARTS...");
    // Start the opponent round
    // opponent1round();
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

// player1round
//
//
function player1round() {
  // Enable the player to select its next action
  enableActions();
  // All possible actions do similar effects
  // The player can only select one before all others are disabled
  // INDEX 0
  $("#unplug").click(() => {
    console.log("clicked");
    console.log($(".spellsActions"));
    actionIndex = 0;
    disableActions();
    dealDamage();
    setTimeout(endPlayerTurn, 1000);
  });
  //
  $("#saturate").click(saturate);
  //
  $("#control").click(control);
}

//
//
//
function endPlayerTurn() {
  //
  let actionSummary = `You have used ${spells[actionIndex].name} and your opponent lost ${damageAmount}% of its battery power.`;
  //
  $("#recap").append(`<p>${actionSummary}</p>`);
  //
  damageAmount = 0;
  //
  updateScroll();
  //
  opponentRound();
}

// dealDamage
//
//
function dealDamage() {
  //
  damageAmount = getRandomElement(spells[actionIndex].points);
  //
  opponentHP -= damageAmount;
  //
  updateBatteryPower();
  //
  $("#opponent1LifeBarText").effect('pulsate');
}

// saturate
//
//
function saturate() {
  console.log("saturate");
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

//
// ??????????????????????????????????????????????????????????????????????????????????????
// Whenever I call player1round again the function doubles...
function endOpponentRound() {
  player1round();
}

//
//
//
function updateScroll() {
  //
  let log = document.getElementById("recap");
  log.scrollTop = log.scrollHeight;
}

// disableActions
//
//
function disableActions() {
  //
  $(".spellsActions").button("disable");
  $(".counterSpellsActions").button("disable");
  $(".itemsActions").button("disable");
}

// enableActions
//
//
function enableActions() {
  //
  $(".spellsActions").button("enable");
  $(".counterSpellsActions").button("enable");
  $(".itemsActions").button("enable");
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
//
function dataError(request, textStatus, error) {
  console.error(error);
}

/// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// getRandomElement
//
// Get a random element from a specific array
function getRandomElement(array) {
  let element = array[Math.floor(Math.random() * array.length)];
  return element;
}