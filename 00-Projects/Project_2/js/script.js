"use strict";

/*****************

#captionMe
Anne Boutet
(✿◠‿◠)

A sly game that transforms the players' intention. Inspired from
James Bridle's essay Something is wrong on the internet. The interface
is a copycat of Instagram and the player's role is to create a caption with
the pools of words provided. He will receive likes for  doing so and more
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
    adjectives: ['this', 'clown', 'clover', 'google', 'disaster', 'stress'],
    captionPart1: 'Just ',
    captionPart2: ' on a ',
    captionPart3: '. ',
    hiddenCaption: 'this is just text that will be hidden',
    fullCaption: 'eating'
  },
  {
    // Busts
    path: 'assets/images/01.jpg',
    verbs: ['love', 'hate', 'feel', 'dance', 'climb'],
    adjectives: ['this', 'clown', 'clover', 'google', 'disaster', 'stress'],
    captionPart1: 'Now ',
    captionPart2: ' on a ',
    captionPart3: '. ',
    hiddenCaption: 'this is just text that will be hidden',
    fullCaption: 'eating'
  }
];
let currentImage = 0;
let currentPost = 0;

// Username
let username = 'xXPerfectGurlXx ';
let trueUsername = 'Not_ListeningXO';

let $post;
let $adj;
let $verb;

// An array to store posts
let posts = [];

// Likes
let likes = 0;

// Caption
let caption = 'This is me saying things';

// Comment
let comment = 'I am hearing everything you are saying #noPrivacyYO';

// Follower count
let followers = 1000;

// Get setup!
$(document).ready(setup);

// setup
//
//
function setup() {
  //
  $(document).one('click', addPost);
  //
  displayCaptionEditor();
  //
  displayAdjs();
  displayVerbs();
  //
  handleWords();
  //
  postButton();
}

// displayCaption
//
//
function displayCaptionEditor() {
  //
  let $captionEditor = $('.captionEditor');
  $adj = $('<div class="adj"></div>');
  $verb = $('<div class="verb"></div>');
  //
  $captionEditor.append(images[currentImage].captionPart1);
  $verb.appendTo($captionEditor);
  $captionEditor.append(images[currentImage].captionPart2);
  $adj.appendTo($captionEditor);
  $captionEditor.append(images[currentImage].captionPart3);
}

// displayAdjs
//
//
function displayAdjs() {
  //
  for (let i = 0; i < images[currentImage].adjectives.length; i++) {
    //
    let $adjContainer = $('<div class="adjs"></div>');
    //
    $adjContainer.appendTo(".adjPool");
    //
    $adjContainer.text(images[currentImage].adjectives[i]);
  }
}

// displayVerbs
//
//
function displayVerbs() {
  //
  for (let i = 0; i < images[currentImage].verbs.length; i++) {
    //
    let $verbContainer = $('<div class="verbs"></div>');
    //
    $verbContainer.appendTo(".verbPool");
    //
    $verbContainer.text(images[currentImage].verbs[i]);
  }
}

// handleWords
//
//
function handleWords() {
  // VERB
  //
  let $verbs = $(".verbs");
  $verbs.draggable({
    revert: true,
    cursor: "move",
    cursorAt: {
      top: 14.2,
      left: 28
    }
  });
  $verb.droppable({
    greedy: $verbs,
    drop: function(event, ui) {
      // the ui is the droppable not the draggable
      $(".verb").text("new verb")
      let $ui = $(event.target.class);
      // SABIIIIIIIIIIIIIIIIIIIINEEEEEEEEEEEEEEEEE! Get dropped element text + Constrain to a class
    }
  });

  // ADJ
  let $adjs = $(".adjs");
  $adjs.draggable({
    revert: true,
    cursor: "move",
    cursorAt: {
      top: 14.2,
      left: 28
    }
  });
  $adj.droppable({
    greedy: $verbs,
    drop: function(event, ui) {
      // the ui is the droppable not the draggable
      $(".adj").text("new adj")
      let $ui = $(event.target.class);
      // SABIIIIIIIIIIIIIIIIIIIINEEEEEEEEEEEEEEEEE! Get dropped element text + Constrain to a class + wrap text for longer words
    }
  });
}

// postButton
//
//
function postButton() {
  let $postButton = $("#postButton");
  $postButton.on("click", publishCaption);
}

//
//
//
function publishCaption() {
  //
  $('.caption').css("background-color", "white");
  $('.caption').empty();
  //
  let combinedCaption = `${images[currentImage].captionPart1}` + $(".verb").text() + `${images[currentImage].captionPart2}` +
    $(".adj").text() + `${images[currentImage].captionPart3}`;
  //
  images[currentImage].fullCaption = combinedCaption;
  //
  let $fullCaption = $(`<p><b>${username}</b>${images[currentImage].fullCaption}</p>`);
  $fullCaption.appendTo(".caption").effect("pulsate", "slow");
  //
  currentImage++;
  //
  resetCaption();
  //
  setTimeout(addPost, 2000);
}

function resetCaption() {
  console.log("reset");
}


// score
//
//
function score() {

}


// PostProperties
//
// Create a class for posts so that every new one has its own
// properties of likes, caption, and comment
class PostProperties {
  constructor($postTemp) {
    this.likes = 0;
    this.caption;
    this.comment;
    this.post = $postTemp;
  }
}

// addPost
//
// Create a full post with a banner, an image, the actions, the status and the date.
function addPost() {
  // POST
  // Create a post that will contain all the elements
  $post = $('<div></div>').addClass('post');
  $post.appendTo('.feed');
  // Add the post to the array
  addList();

  // BANNER
  // Add the banner
  // Create a div
  let $banner = $('<div></div>').addClass('banner');
  $banner.appendTo($post);
  // Add the image of the avatar
  let $avatar = $('<img></img>').addClass('avatar').attr('src', 'assets/images/avatar.png');
  $avatar.appendTo($banner);

  // Display the chosen username
  let $username = $(`<p><b>${username}</b></p>`).addClass('username');
  $username.appendTo($banner);
  // Display the triple dot
  let $tripleDot = $('<img></img>').addClass('tripleDot').attr('src', 'assets/images/triple_dot.png');
  $tripleDot.appendTo($banner);

  // IMAGE
  // Add the image
  let $image = $('<img>').addClass('image').attr('src', images[currentImage].path);
  $image.appendTo($post);

  // ACTIONS
  let $actions = $('<div></div>').addClass('actions');
  $actions.appendTo($post);
  // Add the heart, the speech bubble, the plane, and the bookmark
  let $heart = $('<img></img>').addClass('heart').attr('src', 'assets/images/heart_logo.png');
  $heart.appendTo($actions);
  let $speechBubble = $('<img></img>').addClass('speechBubble').attr('src', 'assets/images/speech_bubble_logo.png');
  $speechBubble.appendTo($actions);
  let $message = $('<img></img>').addClass('message').attr('src', 'assets/images/plane_logo.png');
  $message.appendTo($actions);
  let $bookmark = $('<img></img>').addClass('bookmark').attr('src', 'assets/images/bookmark_logo.png');
  $bookmark.appendTo($actions);

  // STATUS
  let $status = $('<div></div>').addClass('status');
  $status.appendTo($post);
  // Add the likes
  let $likes = $(`<p class='likes'><b>${posts[currentPost].likes} likes</b></p>`);
  $likes.appendTo($post);
  // Add the caption
  let $caption = $(`<div class='caption'><p><b>${username}</b> ${images[currentImage].hiddenCaption}</p></div>`);
  $caption.appendTo($post);
  // Add the comments
  let $comment = $(`<p class='comment'><b>${trueUsername}</b> ${posts[currentPost].comment}</p>`);
  $comment.appendTo($post);

  // DATE
  // Create an array for every month so they are printed as a string not numbers
  let month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  // Get today's date
  let today = new Date();
  // Print it in this format : Month 00, 2000
  let date = month[today.getMonth()] + ' ' + today.getDate() + ', ' + today.getFullYear();
  // Add date
  let $date = $(`<p class='date'>${date}</p>`);
  $date.appendTo($post);
}

// addList
//
// Add the new post to the posts array
function addList() {
  posts.push(new PostProperties($post));
}