"use strict";

/********************************************************************

Condiment Cacophony
Anne Boutet

Generate random sentences by clicking on the screen. 

*********************************************************************/

$(document).ready(setup);

// Global variable for the JSON data
let jsonData;

// Define the random components of the description
let randomCondiment;
let randomCat;
let randomRoom;
let randomName;
let randomTitan;

// setup
//
// Locate te data and handle the user interractions
function setup() {
  // Get the data stored in a JSON file
  $.getJSON("data/data.json")
    .done(dataLoaded)
    .fail(dataError)
  // Check if the user is clicking the document.
  // If so, refresh the description.
  $(document).on("click", displayDescription);
}

// dataLoaded
//
// Store the data in a variable and get random Element
// to display the first sentence.
function dataLoaded(data) {
  // Store the data in a global variable
  jsonData = data;

  // Get random condiments, cats, names, rooms, and titans.
  randomCondiment = getRandomElement(data.condiments);
  randomCat = getRandomElement(data.cats)
  randomRoom = getRandomElement(data.rooms);
  randomName = getRandomElement(data.firstNames);
  randomTitan = getRandomElement(data.greek_titans);

  // Display the first description
  displayDescription();
}

// dataError
//
// If the data hasn't loaded display this message
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

// displayDescription
//
// Reset the last round and display a new sentence
function displayDescription() {
  // get new random elements
  randomCondiment = getRandomElement(jsonData.condiments);
  randomCat = getRandomElement(jsonData.cats);
  randomRoom = getRandomElement(jsonData.rooms);
  randomName = getRandomElement(jsonData.firstNames);
  randomTitan = getRandomElement(jsonData.greek_titans);

  // Remove the past description
  $("body").empty();

  // Check if the subject of the verb is plural for good conjugation
  let verb = "is";
  if (randomCondiment.charAt(randomCondiment.length - 1) === "s") {
    verb = "are";
  }

  // Check if the last letter of a possessive noun, adapt its form
  let possessive = "'s"
  if (randomName.charAt(randomName.length - 1) === "s") {
    possessive = "'";
  }

  // Check the first letter of the following noun to adapt its article
  let article = "a";
  let exceptions = ["A", "E", "I", "O", "U", "H"];
  for (let i = 0; i < exceptions.length; i++) {
    if (randomCat.charAt(0) === exceptions[i]) {
      article = "an";
    }
  }

  // Combine all parts and append it to the body
  let description = `${randomName}${possessive} ${randomCondiment} ${verb} like ${article} ${randomCat} in ${randomTitan}${possessive} ${randomRoom}.`;
  $("body").append(description);
}