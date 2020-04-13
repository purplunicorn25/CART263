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
  //
  $.getJSON("data/spells.json")
    .done(dataLoaded)
    .fail(dataError);
  //
  $("#draw").click(flicker);
}

//
//
//
function flicker() {
  //
  $("#whiteBox").effect('pulsate', 'linear', 800, chooseFirstPlayer);
  //
  $("#draw").hide();
}

//
//
//
function chooseFirstPlayer() {
  let side;
  //
  $("#whiteBox").hide();
  $("#blackBox").hide();
  //
  let randomNumber = Math.random();
  //
  if (randomNumber < 0.5) {
    $("#whiteBox").show();
    side = "white";
  } else if (randomNumber > 0.5) {
    $("#blackBox").show();
    side = "black";
  }
  //
  if ($("#side :selected").val() === side) {
    //
    $("#drawResult").text("YOU START!");
    //
    // player1round();
    //
    setTimeout(beginDuel, 1500);
  } else {
    //
    $("#drawResult").text("YOUR OPPONENT STARTS...");
    //
    // opponent1round();
    //
    setTimeout(beginDuel, 1500);
  }
}

//
//
//
function beginDuel() {
  //
  $("#prepare").append("<h2>PREPARE TO DUEL</h2><p>Show respect to your opponent.</p>");
  //
  setTimeout(() => {
    $(".bow").css("display", "inline-block");
  }, 1500);
  //
  $(".bow").click(() => {
    $("#ready").append("<p>Ready your keyboard...<br>");
    //
    setTimeout(() => {
      $(".start").css("display", "inline-block");
    }, 2000);
  });
  //
  $(".start").click(() => {
    $("#startMenu").hide();
  })
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

/// ??????????????????????????????????????????????????????
// getRandomElement
//
// Get a random element from a specific array
function getRandomElement(array) {
  let element = array[Math.floor(Math.random() * array.length)];
  return element;
}