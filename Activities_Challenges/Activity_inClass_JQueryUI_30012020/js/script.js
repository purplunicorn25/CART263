"use strict";

/********************************************************************

Title of Project
Author Name

This is a template. Fill in the title, author, and this description
to match your project! Write JavaScript to do amazing things below!

*********************************************************************/
const ANIMATION_TIME = 6000;

$(document).ready(setup);

function setup() {
  $('.square').draggable({
    axis: "x",
    stop: makeItPink(),
    stop: function () {
  $(this).draggable('disable')}
  });

  $('.square').resizable();
  $('.square').animate({
    backgroundColor: 'yellow',
    width: '500px'
  },ANIMATION_TIME, 'easeInOutBounce');

  $(document).ready(function () {
  $('#question').dialog();
});
}

function makeItPink() {
  $('.body').css('background-color','magenta');
}
