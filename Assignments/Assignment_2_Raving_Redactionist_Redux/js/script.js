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

// Text components that does not want to stay hidden
let $sensitiveContent;
// Text components that are hidden and waiting to be found
let $secretWords;
let $secretFound;
let $secretTotal;

// Call setup when the page is loaded
$(document).ready(setup);

// setup
//
//
function setup() {
  // SENSITIVE CONTENT
  // Define all the spans to be refered as $sensitiveContent
  $sensitiveContent = $(".redacted");
  // Set an interval for the $sensitiveContent to go from visible to hidden
  setInterval(update, INTERVAL_DURATION);
  // Check if the element is clicked by the user
  $sensitiveContent.on("click", sensitiveContentClicked);
  // SECRETS
  // Count how many spans are secret
  $secretTotal = $(".secret").length;
  // Create an array that regroups all secrets
  $secretWords = $(".secret");
  // Check if the element is hovered by the user
  $secretWords.on("mouseover", secretFound);
}

// update
//
//
function update() {
  // Check  for any sensitive content and update their style
  $sensitiveContent.each(updateSensitiveContent);
  // Display the $secretTotal number to the appropriate span on the page
  $(".secretReportedCounter").text($secretTotal);
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

// secretFound
//
//
function secretFound() {
  //
  $(this).addClass("found");
  //
  $(this).off("mouseover", secretFound);
  //
  $secretTotal -= 1;
}
