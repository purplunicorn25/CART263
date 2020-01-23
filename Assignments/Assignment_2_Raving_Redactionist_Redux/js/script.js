"use strict";

/********************************************************************

Activity 3
Anne Boutet

This is a template. Fill in the title, author, and this description
to match your project! Write JavaScript to do amazing things below!

*********************************************************************/
const REVEAL_PROBABILITY = 0.1;
const INTERVAL_DURATION = 300;

let $spans;

$(document).ready(setup);

function setup() {
  setInterval(update, INTERVAL_DURATION);
  let $spans = $("span");
  $spans.on("click", spanClicked);
}

function update() {
  $("span").each(updateSpan);
}

function updateSpan() {
  let randomNumber = Math.random();
  if (randomNumber < REVEAL_PROBABILITY) {
    $(this).removeClass("redacted");
    $(this).addClass("revealed");
  }
}

function spanClicked() {
  $(this).addClass("redacted");
  $(this).removeClass("revealed");
}
