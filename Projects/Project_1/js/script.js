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

// Call setup when the page is loaded
$(document).ready(setup);

// setup
//
// Handle events and function from the text elements
function setup() {
  //
  $box = $(".box");
  $truck = $(".truck");
  $book = $(".book");
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
  //
  if (booksIn === BOX_FILLED) {
    console.log("box full");
    $("button").click(function(event) {
      event.preventDefault();
    });
  }
}

$("button, input, a").click(function(event) {
  event.preventDefault();
});

// resetBook
//
//
function resetBook() {

}