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
const BOX_FILLED = 20;
const BOOK_PILE_TOP_POSITION = 500;
const BOOK_PILE_BOT_POSITION = 0;
const GRAVITY_TIME = 300;
const NUMBER_BOOKSHELVES = 6;
const NUMBER_BOOKS_ON_SHELF = 10;

// jQuery Variables
let $box;
let $truck;
let $book;

// Variables
let booksIn = 0;
let initialBoxBot;

// Buttons & Instructions
let $fullBoxButton;
let $resetButton;
let $liftInstruction;
let $decoyInstruction;

// Images & Sounds
let $boxImage;
let $bookPile;
let musicSFX = new Audio("assets/sounds/music.mp3");
let booksFallingSFX = new Audio("assets/sounds/bookFalling.mp3");

// Call setup when the page is loaded
$(document).ready(setup);

// setup
//
// Handle events and function from the text elements
function setup() {
  //Play music for ambiance
  musicSFX.loop = true;
  musicSFX.play();

  // Define Objects
  $box = $(".box");
  $truck = $(".truck");
  $book = $(".book");

  // Define Buttons & Instructions
  $fullBoxButton = $("#fullBoxButton");
  $resetButton = $("#resetButton");
  $liftInstruction = $("#liftInstruction");
  $decoyInstruction = $("#decoyInstruction");

  // Define Images
  $boxImage = $("#boxImage");
  $bookPile = $(".bookPile");

  // Create book that fill the bookshelf
  createBooks();

  // Make the books draggable objects
  $book.draggable({
    revert: true
  });

  // Make the box a droppable object
  // Add a function to handle its reactions
  $box.droppable({
    drop: onDrop
  });
  // Record the original position of the box
  initialBoxBot = document.getElementById("boxImage").getBoundingClientRect().top;
}

// onDrop
//
// Handles when the book are dropped in the box
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
// Check if the box is full, close it
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
// Handles when the user drags the box up
function liftBox() {
  // Display instruction for the next step
  $liftInstruction.css("display", "block");
  $decoyInstruction.css("display", "block");
  // Drag the box up vertically, constrain to a certain height
  // Can only be dragged once, when dragged call brokenBox
  $box.draggable({
    axis: "y",
    cursor: "move",
    containment: [0, 250, 0, 500],
    stop: function() {
      $(this).draggable('disable');
      // Remove Instructions
      $liftInstruction.css("display", "none");
      $decoyInstruction.css("display", "none");
      // Call the function when the box is lifted
      brokenBox();
    }
  });
  // Enable the draggable so that the loop is complete
  $box.draggable('enable');
}

// brokenBox
//
// Make the books fall from the box
function brokenBox() {
  // Display the image of the book pile behind the box
  $bookPile.css("display", "block");
  // Change the box image to a broken box
  $boxImage.attr("src", "assets/images/brokenBox.png");
  // Play the sound of books falling
  booksFallingSFX.play();
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
  // Reset all the elements to start again
  reset();
}

// reset
//
// Reset the game in order to start again
function reset() {
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
    $boxImage.css("top", initialBoxBot + "px");
    $box.droppable("enable");
    // Reset book pile position
    $bookPile.css("top", "300px");
    // Remove book pile image
    $bookPile.css("display", "none");
    // Reset book position
    resetBookPositions();
    // Reset book counter
    booksIn = 0;
  });
}

// bookColor
//
// Make the fill color of the books random
function bookColor() {
  // Change the color of each book
  $book.each(function(index, element) {
    // Change the color based on a RGB color system
    let r = Math.random() * 170;
    let g = Math.random() * 200;
    let b = Math.random() * 250;
    // Apply this random fill to the books
    $(element).css("background-color", `rgb(${r}, ${g}, ${b})`);
  })
}

// createBooks
//
// Create books objects on the shelves
function createBooks() {
  // Create an array of the book titles used in html
  let bookTitles = ["To Kill A Mockingbird", "Wuthering Heights", "Little Women", "Lord of the Flies", "Pride & Prejudice",
    "Harry Potter", "Da Vinci Code", "Sherlock Holmes", "Oscar Wilde", "Angela's Ashes", "Jane Eyre", "Beloved", "Ulysses",
    "Don Quixote", "The Great Gatsby", "Moby Dick", "War and Peace", "Lolita", "Hamlet", "The Myth of Sysiphus", "Madame Bovary",
    "Nineteen Eighty Four", "Anna Karenina", "Great Expectations", "Gulliver's Travels", "The Stranger", "The Trial", "Candide",
    "The Lord of the Rings", "Les Misérables", "The Idiot", "Gone With the Wind", "Emma", "The Age of Innocence", "On the Road",
    "Animal Farm", "Frankenstein", "Vanity Fair", "Study in Scarlet", "The Scarlet Letter", "The Handmaid's Tale", "Faust",
    "Les Fleurs du Mal", "Don Juan", "L'École des Femmes", "Antigone", "Robinson Crusoe", "The Book Thief", "Le Parfum",
    "The Help", "Romeo & Juliette", "Ilyade", "Les Trois Mousquetaires"
  ];
  // Create shelves
  for (let i = 0; i < NUMBER_BOOKSHELVES; i++) {
    let shelf = $('<div class="shelf">');
    // Add the shelves to the bookshelf
    $(".bookshelf").append(shelf);
    // For all shelves, add 10 books
    for (let i = 0; i < NUMBER_BOOKS_ON_SHELF; i++) {
      let randomBook = Math.floor(Math.random() * bookTitles.length);
      let book = $('<div class="book">' + bookTitles[randomBook] + '</div>');
      $(shelf).append(book);
    }
  }
  // Make sure that they are recognize by the program
  $book = $(".book");
  // Make the books draggable objects again
  $book.draggable({
    revert: true
  });
  // Apply the color to the new books
  bookColor();
}


// resetBookPositions
//
// Empty the bookshelf and refill it again
function resetBookPositions() {
  // Empty the bookshelf
  $(".bookshelf").empty();
  // Create new books
  createBooks();
}