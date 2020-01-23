"use strict";

/********************************************************************

Activity 3
Anne Boutet

!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
This is a template. Fill in the title, author, and this description
to match your project! Write JavaScript to do amazing things below!

*********************************************************************/

// Constants
const REVEAL_PROBABILITY = 0.1;
const INTERVAL_DURATION = 300;

// Text component that does not want to stay hidden
let $sensitiveContent;
// Text component that are hidden and waiting to be found
let $secretFound;
let $secretTotal;

// Call setup when the page is loaded
$(document).ready(setup);

// setup
//
//
function setup() {
  // Define all the spans to be refered as $sensitiveContent
  $sensitiveContent = $(".redacted");
  // Set an interval for the $sensitiveContent to go from visible to hidden
  setInterval(update, INTERVAL_DURATION);
  // Check if the element is clicked by the user
  $sensitiveContent.on("click", sensitiveContentClicked);
}

// update
//
//
function update() {
  //
  $sensitiveContent.each(updateSensitiveContent);
}

// updateSensitiveContent
//
//
function updateSensitiveContent() {
  //
  //
  let randomNumber = Math.random();
  if (randomNumber < REVEAL_PROBABILITY) {
    $(this).removeClass("redacted");
    $(this).addClass("revealed");
  }
}

// sensitiveContentClicked
//
//
function sensitiveContentClicked() {
  //
  $(this).addClass("redacted");
  $(this).removeClass("revealed");
}
