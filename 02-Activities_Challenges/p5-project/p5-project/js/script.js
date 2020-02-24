"use strict";

/*****************

Title of Project
Author Name

This is a template. You must fill in the title,
author, and this description to match your project!

******************/

let sineWaveB4 = new Pizzicato.Sound({
  source: 'wave',
  options: {
    frequency: 493.88,
    volume: 0.5,
    type: "sawtooth",
    attack: 2,
    release: 2
  }
});
let sineWaveG4 = new Pizzicato.Sound({
  source: 'wave',
  options: {
    frequency: 196,
    volume: 0.5,
    type: "sawtooth",
    attack: 2,
    release: 2
  }
});
let sineWaveF3 = new Pizzicato.Sound({
  source: 'wave',
  options: {
    frequency: 698.46,
    volume: 0.5,
    type: "sawtooth",
    attack: 2,
    release: 2
  }
});

function setup() {}

function mousePressed() {
  sineWaveB4.play();
  sineWaveG4.play();
  sineWaveF3.play();
  setTimeout(stopSineWaves, 2000);
}

function stopSineWaves() {
  sineWaveB4.stop();
  sineWaveG4.stop();
  sineWaveF3.stop();
}