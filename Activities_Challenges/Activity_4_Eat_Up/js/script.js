"use strict";

let $animal;
let $fly;

// Use constant because it means that what's inside the variable will never change
const $buzzing = new Audio("assets/sounds/buzz.mp3");
const $chewing = new Audio("assets/sounds/crunch.wav");

$(document).ready(setup);

function setup() {
  //
  $buzzing.loop = true;
  //
  $animal = $("#animal");
  $fly = $("#fly");
  //
  $fly.draggable({
    start: function() {
      $buzzing.play();
    },
    stop: function() {
      $buzzing.pause();
    }
  });
  $animal.droppable({
    drop: onDrop
  });
}

function onDrop(event, ui) {
  ui.draggable.remove();
  $animal.attr('src', 'assets/images/chewing.gif');
  $chewing.loop = true;
  $chewing.play();
}