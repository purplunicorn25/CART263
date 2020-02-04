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
const BOX_FILLED = 2;

// jQuery Variables
let $box;
let $truck;
let $book;

// Variables
let booksIn = 0;

// Buttons
let $fullBoxButton;

// Images
let $boxImage;

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
  // Define Buttons
  $fullBoxButton = $("#fullBoxButton");
  // Define Images
  $boxImage = $("#boxImage");
  // Make the book fill color random for each book
  $book.each(bookColor); // ????????????????????????????
  //
  $book.draggable();
  //
  $box.droppable({
    drop: onDrop,
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

// checkBox
//
//
function checkBox() {
  // If the box is filled, add a button to change
  // the open box image to a closed box image
  if (booksIn === BOX_FILLED) {
    // Display the button to close the box
    $fullBoxButton.css("display", "inline-block");
    // Check if the button is clicked
    // If so, hide the button and change the image
    $fullBoxButton.click(function(event, ui) {
      $fullBoxButton.css("display", "none");
      $boxImage.attr("src", "assets/images/closedBox.png");
    });
  }
}

// resetBook
//
//
function resetBook() {

}