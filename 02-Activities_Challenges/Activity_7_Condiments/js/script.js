"use strict";

/********************************************************************

Title of Project
Author Name

This is a template. Fill in the title, author, and this description
to match your project! Write JavaScript to do amazing things below!

*********************************************************************/

$(document).ready(setup);

function setup() {
  $.getJSON("data/data.json")
    .done(dataLoaded)
    .fail(dataError)
}

function dataLoaded(data) {
  let randomCondiment = getRandomElement(data.condiments);
  let verb = "is";

  if (randomCondiment.charAt(randomCondiment.length - 1) === "s") {
    verb = "are";
  }
  console.log(verb);

  let randomCat = getRandomElement(data.cats);

  let randomRoom = getRandomElement(data.rooms);

  let description = `${randomCondiment} ${verb} like a ${randomCat} in a ${randomRoom}.`;
  $("body").append(description);
}

function dataError(request, textStatus, error) {
  console.error(error);
}

function getRandomElement(array) {
  let element = array[Math.floor(Math.random() * array.length)];
  return element;
}