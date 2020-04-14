"use strict";

/********************************************************************

Computational Wizard Duel
Anne Boutet

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

// Life of player and opponent in terms of battery level
let playerPower;
let opponentPower;

//
//
//
function setup() {
  // Get the data from the JSON file
  $.getJSON("data/spells.json")
    .done(dataLoaded)
    .fail(dataError);
  // Draw to find out who starts the game
  $("#draw").click(flicker);
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

// dataError
//
//
function dataError(request, textStatus, error) {
  console.error(error);
}

// displaySpells
//
//
function displaySpells() {
  //
  for (let i = 0; i < spells.length; i++) {
    //
    $("#spellButtons").append(`<button>${spells[i].name}</button>`);
  }
  //
  for (let i = 0; i < counterSpells.length; i++) {
    //
    $("#counterSpellButtons").append(`<button>${counterSpells[i].name}</button>`);
  }
  // //
  // for (let i = 0; i < items.length; i++) {
  //   //
  //   $("#itemButtons").append(`<button>${items[i].name}</button>`);
  // }
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
  console.log("player turn");
}

/// ??????????????????????????????????????????????????????
// getRandomElement
//
// Get a random element from a specific array
function getRandomElement(array) {
  let element = array[Math.floor(Math.random() * array.length)];
  return element;
}