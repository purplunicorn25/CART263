"use strict";

/*****************

#captionMe
Anne Boutet
(✿◠‿◠)

A sly game that transforms the players' intention. Inspired from
James Bridle's essay Something is wrong on the internet. The interface
is a copycat of Instagram and the player's role is to create a caption with
the pool of words provided. He will receive likes for  doing so and more
followers at first. Then the captions will get slighty modified every turn
to change the meaning of the picture. The likes and followers will decrease,
and the game is done when you don't have any followers. Captions will be read
with responsivevoice and annyang will listen and add commments to the current
post (sneaky). The game is not randomly generated and is meant to be played
only once as a one time experience: the pictures will be the same, so
will the modified captions, etc.

Uses:

ResponsiveVoice
https://responsivevoice.org/

Annyang
https://www.talater.com/annyang/

Pictures
https://unsplash.com/

******************/

// Constants
const NUMBER_OF_IMAGES = 9;

// Variables
// Posts
let images = [{
    // Mountain
    path: 'assets/images/00.jpg',
    verbs: ['love', 'hate', 'feel', 'dance', 'climb'],
    nouns: ['this', 'clown', 'clover', 'google', 'disaster', 'stress']
  },
  {
    // Busts
    path: 'assets/images/01.jpg',
    verbs: ['love', 'hate', 'feel', 'dance', 'climb'],
    nouns: ['this', 'clown', 'clover', 'google', 'disaster', 'stress']
  },
  {
    // Hide and Seek
    path: 'assets/images/02.jpg',
    verbs: ['love', 'hate', 'feel', 'dance', 'climb'],
    nouns: ['this', 'clown', 'clover', 'google', 'disaster', 'stress']
  }
];
let currentImage = 0;

// Username
let username = 'xXPerfectGurlXx';
let trueUsername = 'Not_ListeningXO'

// Likes
let likes = 300;

// Caption
let caption = 'This is me saying things';

// Comment
let comment = 'I am hearing everything you are saying #noPrivacyYO';

// Follower count
let score = 0;

// Get setup!
$(document).ready(setup);

// setup()
//
//
function setup() {
  addPost();
}

//
//
//
function addPost() {

  // BANNER
  // Add the banner
  // Create a div
  let $banner = $('<div></div>').addClass('banner');
  $banner.appendTo('.feed');
  // Add the image of the avatar
  let $avatar = $('<img></img>').addClass('avatar').attr('src', 'assets/images/avatar.png');
  $avatar.appendTo('.banner');
  // Display the chosen username
  let $username = $(`<h3>${username}</h3>`).addClass('username');
  $username.appendTo('.banner');
  // Display the triple dot
  let $tripleDot = $('<img></img>').addClass('tripleDot').attr('src', 'assets/images/triple_dot.png');
  $tripleDot.appendTo('.banner');

  // IMAGE
  // Add the image
  let $image = $('<img>').addClass('image').attr('src', images[currentImage].path);
  $image.appendTo('.feed');

  // ACTIONS
  let $actions = $('<div></div>').addClass('actions');
  $actions.appendTo('.feed');
  // Add the heart, the speech bubble, the plane, and the bookmark
  let $heart = $('<img></img>').addClass('heart').attr('src', 'assets/images/heart_logo.png');
  $heart.appendTo('.actions');
  let $speechBubble = $('<img></img>').addClass('speechBubble').attr('src', 'assets/images/speech_bubble_logo.png');
  $speechBubble.appendTo('.actions');
  let $message = $('<img></img>').addClass('message').attr('src', 'assets/images/plane_logo.png');
  $message.appendTo('.actions');
  let $bookmark = $('<img></img>').addClass('bookmark').attr('src', 'assets/images/bookmark_logo.png');
  $bookmark.appendTo('.actions');

  // STATUS
  // Add the likes
  let $likes = $(`<p class='likes'><b>${likes} likes</b></p>`);
  $likes.appendTo('.feed');
  // Add the caption
  let $caption = $(`<p class='caption'><b>${username}</b> ${caption} likes</p>`);
  $caption.appendTo('.feed');
  // Add the comments
  let $comment = $(`<p class='comment'><b>${trueUsername}</b> ${comment}</p>`);
  $comment.appendTo('.feed');

  // DATE
  // Create an array for every month so they are printed as a string not numbers
  let month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  // Get today's date
  let today = new Date();
  // Print it in this format : Month 00, 2000
  let date = month[today.getMonth()] + ' ' + today.getDate() + ', ' + today.getFullYear();
  // Add date
  let $date = $(`<p class='date'>${date}</p>`);
  $date.appendTo('.feed');

}