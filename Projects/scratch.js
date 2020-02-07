//
//
//
//function setBookPositions() {

/*$book.each(function(index, element) {

    let cBookTop = $(element).offset().top;
    //  let cBookLeft = $(element).offset().left;
    //  let cBookTop = $(element).position().top;
    let cBookLeft = $(element).position().left;
    //  console.log(cBookTop);


    $(element).attr("origTop", cBookTop);
    $(element).attr("origLeft", cBookLeft);
  });
}

function resetBookPositions() {
  $book.each(function(index, element) {
    let bookParentOffset = $(element).parent().offset();
    console.log(bookParentOffset);

    let cBookTop = $(element).attr("origTop");
    let cBookLeft = $(element).attr("origLeft");
    console.log(parseFloat(cBookTop));
    let topDiff = bookParentOffset.top - parseFloat(cBookTop);
    let leftDiff = bookParentOffset.left - parseFloat(cBookLeft);


    $(element).css("top", topDiff + "px");
    $(element).css("left", cBookLeft + "px");*/

});
}*/


// resetBookPositions
//
// Empty the bookshelf and refill it again
function resetBookPositions() {
  // Empty the bookshelf
  $(".bookshelf").empty();
  // Create an array of the book titles used in html
  let bookTitles = ["To Kill A Mockingbird", "Wuttering Heights", "Little Women", "Lord of the Flies", "Pride & Prejudice", "Harry Potter", "Da Vinci Code", "Sherlock Holmes", "Oscar Wilde", "Angela's Ashes"];
  // Create shelves
  for (let i = 0; i < NUMBER_BOOKSHELVES; i++) {
    let shelf = $('<div class="shelf">');
    // Add the shelves to the bookshelf
    $(".bookshelf").append(shelf);
    // For all shelves, add 10 books
    for (let i = 0; i < bookTitles.length; i++) {
      let book = $('<div class="book">' + bookTitles[i] + '</div>');
      $(shelf).append(book);
    }
  }
  // Make sure that they are recognize by the program
  $book = $(".book");
  // Make the books draggable objects again
  $book.draggable({
    revert: true
  });
  // Apply the color to the new books
  bookColor();
}

bookTop = document.getElementById("boxImage").getBoundingClientRect().top;
console.log(bookTop);