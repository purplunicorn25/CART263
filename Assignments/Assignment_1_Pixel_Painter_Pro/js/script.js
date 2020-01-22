"use strict";

/********************************************************************

Pixel Painter
Anne Boutet

This is a template. Fill in the title, author, and this description
to match your project! Write JavaScript to do amazing things below.

*********************************************************************/

window.addEventListener('load', setup);

function setup() {
    for (let i = 0; i < 1000; i++) {
    let pixel = document.createElement('div');
    pixel.setAttribute('class', 'pixel');
    document.body.appendChild(pixel);
  }
  document.addEventListener('mouseover', paint);
}

function paint(e) {
  let pixel = e.target;
  pixel.style.backgroundColor = 'blue';
  setTimeout(resetPixel, 1000, pixel);

}

function resetPixel(pixel) {
  pixel.style.backgroundColor = 'yellow';
}
