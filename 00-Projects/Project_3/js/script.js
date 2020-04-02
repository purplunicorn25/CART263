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

// Attacks, Blocks, and Items
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
  $.getJSON("data/spells.json")
    .done(dataLoaded)
    .fail(dataError);
}

//
//
//
function dataLoaded(data) {
  // Store the spells in an array
  spells = data.spells;

  // Display the draw to select who starts
  $("#speed").selectmenu();
}

//
//
//
function dataError(request, textStatus, error) {
  console.error(error);
}

// getRandomElement
//
// Get a random element from a specific array
function getRandomElement(array) {
  let element = array[Math.floor(Math.random() * array.length)];
  return element;
}