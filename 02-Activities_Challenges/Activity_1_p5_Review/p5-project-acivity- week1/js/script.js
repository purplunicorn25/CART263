"use strict";

/*****************

ACTVITY WEEK 1 - Circle Eater
Anne Boutet

This is a template. You must fill in the title,
author, and this description to match your project!

******************/

let alive = true;

let player = {
  x: 0,
  y: 0,
  maxSize: 40,
  size: 40
};

let food = {
  x: 0,
  y: 0,
  size: 30
};

// setup()
//
// Description of setup

function setup() {
createCanvas(500,500);

// Set the position of the food to a random location on the canvas
food.x = random(0, 500);
food.y = random(0,500);

// Disable the cursor
noCursor();

// Set a black background
background(0);
}


// draw()
//
// Description of draw()

function draw() {

  if (alive === true) {
  // Refresh the black background
  background(0);

  // Update the player
  updatePlayer();

  // Draw the player
  displayPlayer();

  // Draw the food
  displayFood();

  // Check eating
  checkEating();
}
else if (alive === false){
  push();
  fill(255);
  text("GAME OVER", 250, 250)
  pop(); 
}
}

// updatePlayer()
//
// Update the player's position
function updatePlayer() {

  // The player follows the mouse position
  player.x = mouseX;
  player.y = mouseY;

  // The size of the player is reduced gradually
  player.size -= .3;

  // Constrain the player's size between 0 and its maximum size
  player.size = constrain(player.size, 0, player.maxSize);

  // Check if size is below 0
  if (player.size < 0) {
    alive = false;
  }
}

// displayPlayer
//
// Display the player on the canvas
function displayPlayer() {
  push();
  noStroke();
  fill(200, 0, 100);
  ellipse(player.x, player.y, player.size, player.size);
  pop();
}

// displayFood
//
// Display the food on the canvas
function displayFood() {
  push();
  noStroke();
  fill(255);
  ellipse(food.x, food.y, food.size, food.size);
  pop();
}

// checkEating
//
// Check if the plaer overlaps the food
function checkEating() {

  // Check the distance between the objects
  let d = dist(player.x, player.y, food.x, food.y);

  // Check if they overlap
  if (d < food.size / 2) {
    player.size = player.maxSize;
    food.x = random(0, 500);
    food.y = random(0, 500);
  }
}
