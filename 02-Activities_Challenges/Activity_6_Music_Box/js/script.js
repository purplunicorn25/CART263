"use strict";

/*****************

Music Box
Anne Boutet

This is a template. You must fill in the title,
author, and this description to match your project!

******************/

// Store all the frequencies of a A Major scale
let frequencies = [
  220, 246.94, 277.18, 293.66, 329.63, 369.99, 415.30
];

let kick;
let snare;
let hihat;
let synth;

let drumLoop = ['*', 'o', 'x', 'x', '*', 'o', 'x', 'x'];
let currentBeat = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Create the synth
  synth = new Pizzicato.Sound({
    source: 'wave',
    options: {
      type: 'sine', // This is the default anyway
      volume: '0.5'
    }
  });
  // Load the three drum sounds from wav files
  kick = new Pizzicato.Sound('assets/sounds/kick.wav');
  snare = new Pizzicato.Sound('assets/sounds/snare.wav');
  hihat = new Pizzicato.Sound('assets/sounds/hihat.wav');
}

function playRandomNote() {
  // Pick a random frequency from the array
  let note = random(frequencies);
  // Set the synth's frequency
  synth.frequency = note;
  // If it's not already playing, play the synth
  synth.play();
}

function mousePressed() {
  // Start an interval for the notes
  setInterval(playRandomNote, 500);
  // Start an interval for the drums
  setInterval(playDrum, 500);
}

function playDrum() {
  let drum = drumLoop[currentBeat];

  if (drum === 'x') {
    kick.play();
  }
  if (drum === 'o') {
    snare.play();
  }
  if (drum === '*') {
    hihat.play();
  }

  currentBeat += 1;

  if (currentBeat >= drumLoop.length) {
    currentBeat = 0;
  }
}