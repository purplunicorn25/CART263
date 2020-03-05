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
const LIKES_PROBABILLITY = 0.2;
const ADDED_WORD_WIDTH = 25;
const REVEAL_PROBABILITY = 0.1;
const UPDATE_RATE = 100;

// Variables
// Posts
let images = [{
    // Mountain
    path: 'assets/images/00.jpg',
    verbs: ['thisthisthisthisthisthis', 'hate', 'feel', 'dance', 'climb'],
    adjectives: ['thisthisthisthisthisthis', 'clown', 'clover', 'google', 'disaster', 'stress'],
    captionPart1: 'Just ',
    captionPart2: ' on a ',
    captionPart3: '. ',
    hiddenCaption: 'this is just text that will be hidden',
    fullCaption: '',
    likes: 0,
    maxLikes: 123,
    followerProbability: 0.05,
    followerSum: 1,
    fullCaptionE: 0
  },
  {
    // Busts
    path: 'assets/images/01.jpg',
    verbs: ['love', 'hate', 'feel', 'dance', 'climb'],
    adjectives: ['marvelous', 'glamourous', 'clover', 'google', 'disaster', 'stress'],
    captionPart1: 'Now ',
    captionPart2: ' on a ',
    captionPart3: '. ',
    hiddenCaption: 'this is just text that will be hidden',
    fullCaption: '',
    likes: 0,
    maxLikes: 106,
    followerProbability: 0.05,
    followerSum: 1
  },
  {
    // Busts
    path: 'assets/images/02.jpg',
    verbs: ['love', 'hate', 'feel', 'dance', 'climb'],
    adjectives: ['marvelous', 'glamourous', 'clover', 'google', 'disaster', 'stress'],
    captionPart1: 'Now ',
    captionPart2: ' on a ',
    captionPart3: '. ',
    hiddenCaption: 'this is just text that will be hidden',
    fullCaption: '',
    likes: 0,
    maxLikes: 92,
    followerProbability: 0.1,
    followerSum: -1
  }
];

// The ULTIMATE variable of this game
let currentImage = 0;

// GAME
let playing = false;
let gameOver = false;

// USERNAME
let username = 'xXPerfectGurlXx ';
let trueUsername = 'Not_ListeningXO';

// CAPTION
let $adj;
let $verb;
let $captionEditor;

// POSTS
let posts = [];
let $post;

// LIKES
let likes = 0;
let likesRate = 1000;

// COMMENT
let comment = 'I am hearing everything you are saying #noPrivacyYO';

// FOLLOWERS
let followers = 509;

// Get setup!
$(document).ready(setup);

// setup
//
//
function setup() {
  //
  addPost();
  //
  displayCaptionEditor();
  //
  displayAdjs();
  displayVerbs();
  //
  displayScore();
  //
  postButton();
  //
  handleWords();
  //
  setInterval(handleLikes, UPDATE_RATE);
  //
  setInterval(handleScore, UPDATE_RATE);

  console.log(gameOver);
}

// displayCaption
//
//
function displayCaptionEditor() {
  //
  $captionEditor = $('.captionEditor');
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
    accept: $verbs,
    drop: function(event, ui) {
      // the ui is the droppable not the draggable
      $(".verb").text($(ui.draggable[0]).text());
      //
      let updatedWidth = ui.draggable[0].getBoundingClientRect().width + ADDED_WORD_WIDTH;
      $(".verb").css("width", updatedWidth);
      //
      handleButton();
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
    accept: $adjs,
    drop: function(event, ui) {
      //
      $(".adj").text($(ui.draggable[0]).text());
      //
      let updatedWidth = ui.draggable[0].getBoundingClientRect().width + ADDED_WORD_WIDTH;
      $(".adj").css("width", updatedWidth);
      //
      handleButton();
    }
  });
}

// postButton
//
//
function postButton() {
  //
  let $postButton = $("#postButton");
  $postButton.button();
  $postButton.button('disable');
  //
  $postButton.on("click", publishCaption);
}

// handleButton
//
//
function handleButton() {
  //
  let $postButton = $("#postButton");
  if ($('.verb').text() !== '' && $('.adj').text() !== '') {
    console.log("filled");
    $("#postButton").button('enable');
  }
}

// publishCaption
//
//
function publishCaption() {
  //
  $('.caption').css("background-color", "white");
  // $('.caption').empty();
  //
  let combinedCaption = `${images[currentImage].captionPart1}` + $(".verb").text() + `${images[currentImage].captionPart2}` +
    $(".adj").text() + `${images[currentImage].captionPart3}`;
  //
  images[currentImage].fullCaption = combinedCaption;
  //
  let fullCaptionE = posts[currentImage].post.children('.caption')[0];
  $(fullCaptionE).html(`<p><b>${username}</b> ${images[currentImage].fullCaption}</p>`).effect("pulsate", "slow").addClass('.caption');
  //
  responsiveVoice.speak(images[currentImage].fullCaption, 'US English Female');
  //
  resetCaption();
  //
  setTimeout(addPost, 2000);
}

// handleLikes
//
//
function defineLikes() {
  //
  if (currentImage > 0) {
    for (let i = 0; i < currentImage; i++) {
      //
      if (images[i].likes < images[i].maxLikes) {
        images[i].likes++;
        //
        let likesE = posts[i].post.children('.likes')[0];
        $(likesE).css("font-weight", "bold");
        $(likesE).text(`${images[i].likes} likes`);
      }
    }
  }
}

// handleLikes
//
//
function handleLikes() {
  let randomNumber = Math.random();
  if (randomNumber < REVEAL_PROBABILITY) {
    defineLikes();
  }
}

// displayScore
//
//
function displayScore() {
  //
  $('.score').append(`<b>${followers}</b><p>Followers</p>`);
  //
  $('.numPosts').append(`<b>${posts.length}</b><p>Posts</p>`);
  //
  $('.following').append(`<b>644</b><p>Following</p>`);
}

// updateScore
//
//
function updateScore() {
  //
  let numPostsE = $('.numPosts').children('b')[0];
  $(numPostsE).text(posts.length);
  //
  let followersE = $('.score').children('b')[0];
  $(followersE).text(followers);
}

// handleScore
//
//
function handleScore() {
  //
  let randomNumber = Math.random();
  //
  if (currentImage === images.length) {
    followers -= 10;
    gameOver = true;
    //
  } else if (randomNumber < images[currentImage].followerProbability) {
    followers += images[currentImage].followerSum;
  }
  //
  updateScore();
}

// resetCaption
//
//
function resetCaption() {
  //
  $captionEditor.empty();
  $(".verbs").remove();
  $(".adjs").remove();
  //
  displayCaptionEditor();
  displayVerbs();
  displayAdjs();
  //
  handleWords();
  //
  currentImage++;
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
  let $likes = $(`<p class='likes'><b>${images[currentImage].likes} likes</b></p>`);
  $likes.appendTo($post);
  // Add the caption
  let $caption = $(`<div class='caption'><p><b>${username}</b> ${images[currentImage].hiddenCaption}</p></div>`);
  $caption.appendTo($post);
  // Add the comments
  let $comment = $(`<p class='comment'><b>${trueUsername}</b> ${images[currentImage].comment}</p>`);
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

  // Add the post to the array
  addList($post);
}

// addList
//
// Add the new post to the posts array
function addList($post) {
  posts.push(new PostProperties($post));
}