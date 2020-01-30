"use strict";

/********************************************************************

Activity 3
Anne Boutet

The user tries to keep the text hidden by clicking it when it is
uncovered. The user can also try to find the secret words that are
hiding in the crowd of words. A counter keeps track of how many are
left to find. 

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
// Handle events and function from the text elements
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
// Update the information from the elements in setup
function update() {
  // Check  for any sensitive content and update their style
  $sensitiveContent.each(updateSensitiveContent);
  // Display the $secretTotal number to the appropriate span on the page
  $(".secretReportedCounter").text($secretTotal);
}

// updateSensitiveContent
//
// Update if the sensitive text is revealed with a random value
function updateSensitiveContent() {
  // Use a random number in the condition in order to make the behavior
  // less predictable
  let randomNumber = Math.random();
  if (randomNumber < REVEAL_PROBABILITY) {
    $(this).removeClass("redacted");
    $(this).addClass("revealed");
  }
}

// sensitiveContentClicked
//
// Handle what happens if the sensitive content is clicked
function sensitiveContentClicked() {
  // Switch from hidden to revealed
  $(this).addClass("redacted");
  $(this).removeClass("revealed");
}

// secretFound
//
// Handles the score and the search for secret text
function secretFound() {
  // Change its style to make it look invisible
  $(this).addClass("found");
  // Check is the mouse is over the text component
  $(this).off("mouseover", secretFound);
  // Adjust counter for the remaining amont of secrets to be found
  $secretTotal -= 1;
}