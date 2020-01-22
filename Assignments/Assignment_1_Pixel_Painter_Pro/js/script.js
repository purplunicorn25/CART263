"use strict";

/********************************************************************

Pixel Painter Pro
Anne Boutet
&
Pippin Barr (comments) :)

A small DOM-based program for "painting" on div-based pixels.

*********************************************************************/

// Constants
const NUM_PIXELS = 1000;
const PIXEL_REVERT_DELAY = 1000;
const DEFAULT_COLOR = "yellow";
const PAINT_COLOR = "white";

// Set up our starting function for when the page loads
window.addEventListener("load", setup);

// setup
//
// Adds DIVs to the page along with event listeners that will allow
// then to change color on mouseover.
function setup() {
  // A loop that runs once per pixel we need
  for (let i = 0; i < 1000; i++) {
    // Create a DIV and store it in a variable
    let pixel = document.createElement("div");
    // Add the 'pixel' class to the new element
    pixel.setAttribute("class", "pixel");
    // Add a mouseover handler to the new element
    document.addEventListener("mouseover", paint);
    // Add a click handler to the new element
    document.addEventListener("click", remove);
    // Add a keydown handler to the new element
    document.addEventListener("keydown", rotate);
    // Add the element to the body of the page
    document.body.appendChild(pixel);
  }
}

// paint
//
// Called by the mouseover event handler on each pixel. Changes
// the pixel's color and sets a timer for it to revert.
function paint(e) {
  // e.target contains the specific element moused over so let's
  // save that into a variable for clarity.
  let pixel = e.target;
  // Change the background color values randomly
  let r = Math.random() * 255;
  let g = Math.random() * 10;
  let b = Math.random() * 255;
  // Apply these change to the pixel
  pixel.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
  // Set a timeout to call the reset function after a delay
  // When we pass additional parameters (like 'pixel' below) they
  // are passed to the callback function (resetPixel)
  setTimeout(resetPixel, 1000, pixel);
}

// remove
//
// Called by the click event handler on each pixel. Removes
// the opacity of the pixel to make it look like a hole.
function remove(e) {
  // e.target contains the specific element moused over so let's
  // save that into a variable for clarity.
  let pixel = e.target;
  // Change the opacity value to 0
  pixel.style.opacity = "0";
}

// rotate
//
// Called by the keydown event handler on each pixel. Rotates
// the pixel by 1 degree.
function rotate(e) {
  // e.target contains the specific element moused over so let's
  // save that into a variable for clarity.
  let pixel = e.target;
  // Rotate the pixel by 1 degree at every event
  // Counter-clockwise when left arrow is pressed
  if (event.keyCode === 37) {
    pixel.style.transform += "rotate(-1deg)";
    // Clockwise when right arrow is pressed
  } else if (event.keyCode === 39) {
    pixel.style.transform += "rotate(1deg)";
  }
}

// resetPixel
//
// Takes the provided pixel element and sets its color back to default
function resetPixel(pixel) {
  pixel.style.backgroundColor = DEFAULT_COLOR;
}
