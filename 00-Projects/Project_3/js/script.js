"use strict";

/********************************************************************

Title of Project
Author Name

This is a template. Fill in the title, author, and this description
to match your project! Write JavaScript to do amazing things below!

*********************************************************************/

$(document).ready(setup);


function setup() {
  $.getJSON("data/spells.json")
    .done(dataLoaded)
    .fail(dataError);
}

function dataLoaded(data) {
  console.log(loaded);
}

function dataError(request, textStatus, error) {
  console.error(error);
}