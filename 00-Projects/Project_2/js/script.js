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
post (sneaky) **TO BE ADDED LATER. The game is not randomly generated and is meant to be played
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
    followersFluctuation: 1,
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
    followersFluctuation: 1
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
    followersFluctuation: -1
  }
];

// The ULTIMATE variable of this game
let currentImage = 0;

// GAME
let playing = false;

// USERNAME
let username = 'xXPurfectKittyXx ';
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
// Displays all the elements, their initial behaviors
// and update the status elements (followers & likes)
function setup() {
  // Add the first post
  addPost();
  // Display the caption editor
  displayCaptionEditor();
  // Display the word options
  displayAdjs();
  displayVerbs();
  // Display the score
  displayScore();
  // Display the button
  postButton();
  // Deal with the behavior of the words and word boxes
  handleWords();
  // Always update the likes
  setInterval(handleLikes, UPDATE_RATE);
  // Always update the score
  setInterval(handleScore, UPDATE_RATE);
}

// displayCaption
//
// Create the sentence and divs that allow the user to compose a sentence
function displayCaptionEditor() {
  // Create the divs for the two type of words
  $captionEditor = $('.captionEditor');
  $adj = $('<div class="adj"></div>');
  $verb = $('<div class="verb"></div>');
  // Append all the text elements in order
  $captionEditor.append(images[currentImage].captionPart1);
  $verb.appendTo($captionEditor);
  $captionEditor.append(images[currentImage].captionPart2);
  $adj.appendTo($captionEditor);
  $captionEditor.append(images[currentImage].captionPart3);
}

// displayAdjs
//
// Display all the adjs objects
function displayAdjs() {
  // Select all of them in the array
  for (let i = 0; i < images[currentImage].adjectives.length; i++) {
    // Create divs for them
    let $adjContainer = $('<div class="adjs"></div>');
    // Put them in the container
    $adjContainer.appendTo(".adjPool");
    // Apply the text
    $adjContainer.text(images[currentImage].adjectives[i]);
  }
}

// displayVerbs
//
// Display all the verbs objects
function displayVerbs() {
  // Select all of them in the array
  for (let i = 0; i < images[currentImage].verbs.length; i++) {
    // Create divs for them
    let $verbContainer = $('<div class="verbs"></div>');
    // Put them in the container
    $verbContainer.appendTo(".verbPool");
    // Apply the text
    $verbContainer.text(images[currentImage].verbs[i]);
  }
}

// handleWords
//
// Handle the behavior of the words and the boxes
function handleWords() {
  // VERB
  // Make verbs draggable and verb droppable
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
      // Apply the text of the draggable to the droppable
      $(".verb").text($(ui.draggable[0]).text());
      // Ensure the width corresponds to the word
      let updatedWidth = ui.draggable[0].getBoundingClientRect().width + ADDED_WORD_WIDTH;
      $(".verb").css("width", updatedWidth);
      // Enable the button if both boxes are filled
      handleButton();
    }
  });
  // ADJ
  // Make ajds draggable and adj droppable
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
      // Apply the text of the draggable to the droppable
      $(".adj").text($(ui.draggable[0]).text());
      // Ensure the width corresponds to the word
      let updatedWidth = ui.draggable[0].getBoundingClientRect().width + ADDED_WORD_WIDTH;
      $(".adj").css("width", updatedWidth);
      // Enable the button if both boxes are filled
      handleButton();
    }
  });
}

// postButton
//
// Create a button that publishes the caption
function postButton() {
  // Created a button that is disabled
  let $postButton = $("#postButton");
  $postButton.button();
  $postButton.button('disable');
  // Publish the caption when clicked
  $postButton.on("click", publishCaption);
}

// handleButton
//
// Checks if the box for the verb and the adjective are filled
// before being able to publish the caption
function handleButton() {
  // If the boxes are both filled, enable the button
  let $postButton = $("#postButton");
  if ($('.verb').text() !== '' && $('.adj').text() !== '') {
    $("#postButton").button('enable');
  }
}

// publishCaption
//
// Combine and publish the new caption and call a new post when done
function publishCaption() {
  // Remove the mask of the caption
  $('.caption').css("background-color", "white");
  // Combine all the caption parts
  let combinedCaption = `${images[currentImage].captionPart1}` + $(".verb").text() + `${images[currentImage].captionPart2}` +
    $(".adj").text() + `${images[currentImage].captionPart3}`;
  // Store it in a variable
  images[currentImage].fullCaption = combinedCaption;
  // Apply the text to the right post
  let fullCaptionE = posts[currentImage].post.children('.caption')[0];
  $(fullCaptionE).html(`<p><b>${username}</b> ${images[currentImage].fullCaption}</p>`).effect("pulsate", "slow").addClass('.caption');
  // Read it for the user to notice the changes
  responsiveVoice.speak(images[currentImage].fullCaption, 'US English Female');
  // Call a new post
  resetCaption();
}

// handleLikes
//
// Create the likes and apply them to the right post
function defineLikes() {
  // Only update the likes after the caption is published
  if (currentImage > 0) {
    for (let i = 0; i < currentImage; i++) {
      // Constrain the likes to a number
      if (images[i].likes < images[i].maxLikes) {
        images[i].likes++;
        // Update the text
        let likesE = posts[i].post.children('.likes')[0];
        $(likesE).css("font-weight", "bold");
        $(likesE).text(`${images[i].likes} likes`);
      }
    }
  }
}

// handleLikes
//
// Calls the likes incrementation randomly
function handleLikes() {
  // Get a random number
  let randomNumber = Math.random();
  // To make it unpredictable, only change the likes if =>
  if (randomNumber < REVEAL_PROBABILITY) {
    defineLikes();
  }
}

// displayScore
//
// Create and display the score interface
function displayScore() {
  // Create the score
  $('.score').append(`<b>${followers}</b><p>Followers</p>`);
  // Create the post counter
  $('.numPosts').append(`<b>${posts.length}</b><p>Posts</p>`);
  // Create the follower counter
  $('.following').append(`<b>644</b><p>Following</p>`);
}

// updateScore
//
// Rewrite the text to keep it up to date
function updateScore() {
  // Update the number of posts
  let numPostsE = $('.numPosts').children('b')[0];
  $(numPostsE).text(posts.length);
  // Update the number of followers
  let followersE = $('.score').children('b')[0];
  $(followersE).text(followers);
}

// handleScore
//
// Handle the follower fluctuation and losing
function handleScore() {
  // Get a random number
  let randomNumber = Math.random();
  // Constrain the followers between a max and min
  // While there are images
  if (currentImage < images.length) {
    // Uppdate the followers according to the images properties
    if (randomNumber < images[currentImage].followerProbability) {
      followers += images[currentImage].followersFluctuation;
    }
  } else { // When there are no more images drop the followers to 0 and call game over
    if (followers > 0) {
      followers -= 1;
      // Call the report alert
      endGame();
    }
  }
  // Rewrite the score
  updateScore();
}

// constrain
//
// Constrain the value of a number between a max and a min value
function constrain(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

// resetCaption
//
// Reset the caption editor with new words
// Move currentImage by 1 to access the next picture
function resetCaption() {
  // Move to the next image
  currentImage++;
  // Empty all the div containers
  $captionEditor.empty();
  $(".verbs").remove();
  $(".adjs").remove();
  // Refill the container and call a new image if there are more
  if (currentImage < images.length) {
    // Fill them up again with the content of the next post
    displayCaptionEditor();
    displayVerbs();
    displayAdjs();
    // Make sure they behave correctly
    handleWords();
    // Add the new post to the page
    setTimeout(addPost, 2000);
  }
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
  // // Add the comments
  // let $comment = $(`<p class='comment'><b>${trueUsername}</b> ${images[currentImage].comment}</p>`);
  // $comment.appendTo($post); // **TO BE ADDED LATER

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

// endGame
//
// Display an alert saying that the account was reported
function endGame() {
  // Display the div
  let $reported = $(".reported");
  $reported.css("display", "block");
  // Add the report text
  $reported.html(`<h1>!! ${username} HAS <br> BEEN REPORTED !!</h1> <br><br><br><br><br><br><br><p>Your account has been reported, you don't have any followers anymore.</p><br><p>You suck.</p>`);

}