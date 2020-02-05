"use strict";

/********************************************************************

Project 1: Paper Boxes
Anne Boutet

In this game, the player attemps to move his books from the bookshelf
to the moving truck. He fills the box, closes the box and moves it up.
As it moves it up the books fall down and he has to start all over. This
game is an endless loop of failure inspired from the myth of Sysiphus.

*********************************************************************/

// Constants
const BOX_FILLED = 1;
const BOOK_PILE_TOP_POSITION = 500;
const BOOK_PILE_BOT_POSITION = 0;
const GRAVITY_TIME = 300;

// jQuery Variables
let $box;
let $truck;
let $book;

// Variables
let booksIn = 0;

// Buttons & Instructions
let $fullBoxButton;
let $resetButton;
let $liftInstruction;

// Images
let $boxImage;
let $bookPile;

// Call setup when the page is loaded
$(document).ready(setup);

// setup
//
// Handle events and function from the text elements
function setup() {
  // Define Objects
  $box = $(".box");
  $truck = $(".truck");
  $book = $(".book");

  // Define Buttons & Instructions
  $fullBoxButton = $("#fullBoxButton");
  $resetButton = $("#resetButton");
  $liftInstruction = $("#liftInstruction");

  // Define Images
  $boxImage = $("#boxImage");
  $bookPile = $(".bookPile");

  // Make the book fill color random for each book
  $book.each(bookColor); // ????????????????????????????
  // Make the books draggable objects
  $book.draggable({
    revert: true
  });
  // Make the box a droppable object
  // Add a function to handle its reactions
  $box.droppable({
    drop: onDrop
  });
}

// onDrop
//
//
function onDrop(event, ui) {
  // Drop the book in the box and use a scale effect
  // to make it look like its going in
  ui.draggable.hide("scale");
  // Add one book to the count so we know when its full
  booksIn += 1;
  // Check when the box is full
  checkBox();
}

// checkBox
//
//
function checkBox() {
  // If the box is filled, add a button to change
  // the open box image to a closed box image
  if (booksIn === BOX_FILLED) {
    // You can't had more books
    $box.droppable("disable");
    // Display the button to close the box
    $fullBoxButton.css("display", "inline-block");
    // Check if the button is clicked
    // If so, hide the button and change the image
    $fullBoxButton.click(function(event, ui) {
      $fullBoxButton.css("display", "none");
      $boxImage.attr("src", "assets/images/closedBox.png");
      // Call the function to pick up the box
      liftBox();
    });
  }
}

// liftBox
//
//
function liftBox() {
  // Display instruction for the next step
  $liftInstruction.css("display", "block");
  // Drag the box up vertically, constrain to a certain height
  // Can only be dragged once, when dragged call brokenBox
  $box.draggable({
    axis: "y",
    cursor: "move",
    containment: [0, 300, 0, 500],
    stop: function() {
      $(this).draggable('disable');
      $liftInstruction.css("display", "none");
      brokenBox();
    }
  });
}

// brokenBox
//
//
function brokenBox() {
  // Display the image of the book pile behind the box
  $bookPile.css("display", "block");
  // Change the box image to a broken box
  $boxImage.attr("src", "assets/images/brokenBox.gif");
  // Source:
  // https://stackoverflow.com/questions/8518400/jquery-animate-from-css-top-to-bottom
  // Move the book pile down.
  $bookPile.animate({
    top: BOOK_PILE_TOP_POSITION
  }, GRAVITY_TIME, function() {
    $bookPile.css({
      bottom: BOOK_PILE_BOT_POSITION
    });
  });
  resetBook();
}

// resetBook
//
//
function resetBook() {
  // Display the button to reset the books
  $resetButton.css("display", "inline-block");
  // Check if the button is clicked
  // If so, hide the button and reset the books position,
  // the box image, book counter, and the book pile
  $resetButton.click(function(event, ui) {
    // Hide button once clicked
    $resetButton.css("display", "none");
    // Reset box image, position and function
    $boxImage.attr("src", "assets/images/box.png");
    $boxImage.css("bottom", "100px"); //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    $box.droppable("enable");
    // Reset book pile position
    $bookPile.css("top", "300px");
    // Remove book pile image
    $bookPile.css("display", "none");
    // Reset book counter
    booksIn = 0;
  });
}

// bookColor
//
// Make the fill color of the books random
function bookColor() {
  // Change the color based on a RGB color system
  let r = Math.random() * 255;
  let g = Math.random() * 10;
  let b = Math.random() * 255;
  // Apply this random fill to the books
  $book.css("background-color", `rgb(${r}, ${g}, ${b})`);
}