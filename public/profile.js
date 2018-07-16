document.querySelectorAll('#main-nav ul li')[1].querySelector('a').classList.add('active');

var user = document.querySelector('#user').innerHTML;
user = JSON.parse(user);
var who = 'you';
var helping_verb = 'have';

var favourites = document.querySelector('#fav');
var shelf = document.querySelector('#shelf');
var want_to_read = document.querySelector('#want_to_read');
var currently_reading = document.querySelector('#currently_reading');
var finished_reading = document.querySelector('#finished_reading');
var activity = document.querySelector('#activity');

function setReadingStatus() {
  want = [];
  current = [];
  finished = [];
  want_to_read.innerHTML = '';
  currently_reading.innerHTML = '';
  finished_reading.innerHTML = '';
  if(user.reading_status.length > 0){
    user.reading_status.forEach(function(status) {
      if(status.status == 'want_to_read'){
        want.push(status.book_id);
      }
      if(status.status == 'currently_reading'){
        current.push(status.book_id);
      }
      if(status.status == 'finished_reading'){
        finished.push(status.book_id);
      }
    });
  }
}
setReadingStatus();

function get_books(book_id, return_books) {
  if (window.XMLHttpRequest) { // Mozilla, Safari, IE7+ ...
    var xhr = new XMLHttpRequest();
  } else if (window.ActiveXObject) { // IE 6 and older
    var xhr = new ActiveXObject("Microsoft.XMLHTTP");
  }
  url = 'https://www.googleapis.com/books/v1/volumes/' + book_id + '?key=AIzaSyDlb433NFdDrzlqiQ73rKNEi8VPh4x8fZo';
  xhr.open('GET', url, true);
  xhr.send();
  xhr.onreadystatechange = function() {
    var DONE = 4;
    var OK = 200;
    if(xhr.readyState === DONE){
      if(xhr.status === OK){
        return_books.apply(this, [JSON.parse(xhr.responseText)]);
      }
      else{
        return_books.apply(this, [null]);
      }
    }
  }
};

function addBook(container, book, activity = false, extra = false){
  var div = document.createElement('div');
  div.setAttribute('class', 'container');
  var img = document.createElement('img');
  img.src = book.volumeInfo.imageLinks.thumbnail;
  var h3 = document.createElement('h3');
  h3.setAttribute('class', 'card-title');
  h3.innerHTML = book.volumeInfo.title;
  var h5 = document.createElement('h5');
  h5.setAttribute('class', 'card-subtitle text-muted');
  var authors = book.volumeInfo.authors;
  if(authors){
    h5.innerHTML = '- ';
    for(var i=0; i<authors.length; ++i){
      if(i==authors.length-1){
        h5.innerHTML += authors[i];
      }
      else {
        h5.innerHTML += authors[i]+', ';
      }
    }
  }
  if(activity != false){
    var p = document.createElement('p');
    if(activity == 'liked'){
      p.innerHTML = who + ' liked the book';
    }else if (activity == 'disliked') {
      p.innerHTML = who + ' disliked the book';
    }
    else if (activity == 'shelf') {
      p.innerHTML = who + ' added the book to your shelf';
    }else if (activity == 'favourite') {
      p.innerHTML = who + ' marked the book as favourite';
    }else if (activity == 'review') {
      p.innerHTML = who + ' reviewed the book as '+extra;
    }
    else if (activity == 'reading_status') {
      if(extra == 'want_to_read'){
        p.innerHTML = who + ' want to read this book';
      }else if (extra == 'currently_reading') {
        p.innerHTML = who + ' are currently reading this book';
      }else if (extra == 'finished_reading') {
        p.innerHTML = who + ' ' + helping_verb + ' finished reading this book';
      }
    }
    else if (activity == 'rated') {
      p.innerHTML = who + ' ' + helping_verb + ' rated ' + extra +' to this book';
    }
  }

  div.appendChild(img);
  div.appendChild(h3);
  div.appendChild(h5);
  if(activity != false){
    div.appendChild(p);
  }
  container.appendChild(div);
}

function AddFavs() {
  favourites.innerHTML = '';
  var i = 0;
  var return_books = function (books_raw){
    var book = books_raw;
    ++i;
    if(i < user.favourites.length){
      get_books(user.favourites[i].book_id, return_books);
    }
    // console.log(book);
    addBook(favourites, book);
  };
  get_books(user.favourites[0].book_id, return_books);
}

function AddShelf() {
  shelf.innerHTML = '';
  var i = 0;
  var return_books = function (books_raw){
    var book = books_raw;
    ++i;
    if(i < user.shelf.length){
      get_books(user.shelf[i].book_id, return_books);
    }
    // console.log(book);
    addBook(shelf, book);
  };
  get_books(user.shelf[0].book_id, return_books);
}

function addWant() {
  want_to_read.innerHTML = '';
  var i = 0;
  var return_books = function (books_raw){
    var book = books_raw;
    ++i;
    if(i < want.length){
      get_books(want[i], return_books);
    }
    // console.log(book);
    addBook(want_to_read, book);
  };
  get_books(want[0], return_books);
}

function addCurrent() {
  currently_reading.innerHTML = '';
  var i = 0;
  var return_books = function (books_raw){
    var book = books_raw;
    ++i;
    if(i < current.length){
      get_books(current[i], return_books);
    }
    // console.log(book);
    addBook(currently_reading, book);
  };
  get_books(current[0], return_books);
}

function addFinished() {
  finished_reading.innerHTML = '';
  var i = 0;
  var return_books = function (books_raw){
    var book = books_raw;
    ++i;
    if(i < finished.length){
      get_books(finished[i], return_books);
    }
    // console.log(book);
    addBook(finished_reading, book);
  };
  get_books(finished[0], return_books);
}

function addActivity() {
  activity.innerHTML = '';
  var h1 = document.createElement('h1');
  h1.setAttribute('class', 'display-4');
  h1.innerHTML = 'Activity';
  activity.appendChild(h1);
  var i = user.activities.length - 1;
  var return_books = function (books_raw){
    var book = books_raw;
    --i;
    if(i >= 0){
      get_books(user.activities[i].book_id, return_books);
    }
    // console.log(book);
    addBook(activity, book, user.activities[i+1].activity, user.activities[i+1].extra_text);

  };
  get_books(user.activities[user.activities.length - 1].book_id, return_books);
}

function displayStuff(show_activity = true) {
  if(user.favourites.length > 0){
    AddFavs();
  }
  if(user.shelf.length > 0){
    AddShelf();
  }
  if(want.length > 0){
    addWant();
  }
  if(current.length > 0){
    addCurrent();
  }
  if(finished.length > 0){
    addFinished();
  }
  activity.innerHTML = '';
  if(user.activities.length > 0 && show_activity){
    addActivity();
  }
}
displayStuff();

var form = document.querySelector('form');
form.addEventListener('submit', function(e) {
  e.preventDefault();
  var username = form.querySelector('form input').value;
  if (window.XMLHttpRequest) { // Mozilla, Safari, IE7+ ...
    var xhr = new XMLHttpRequest();
  } else if (window.ActiveXObject) { // IE 6 and older
    var xhr = new ActiveXObject("Microsoft.XMLHTTP");
  }
  xhr.open('POST', '/profile', true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(JSON.stringify({username: username}));
  xhr.onreadystatechange = function() {
    var DONE = 4;
    var OK = 200;
    if(xhr.readyState === DONE){
      if(xhr.status === OK){
        if(xhr.responseText){
          document.querySelector('#user_not_found').innerHTML = '';
          document.querySelector('#user_not_found').style.display = 'none';
          user = JSON.parse(xhr.responseText);
          who = user.username;
          helping_verb = 'had';
          setReadingStatus();
          console.log(user.activity_mode);
          displayStuff(user.activity_mode);
        }else{
          document.querySelector('#user_not_found').innerHTML = 'the user does not exist';
          document.querySelector('#user_not_found').style.display = 'block';
        }
      }
    }
  }
});

document.querySelectorAll('.activity')[1].addEventListener('click', function(e) {
  // console.log(e.target);
  if(e.target.innerHTML == 'private'){
    var activity_mode = true;
  }else {
    var activity_mode = false;
  }
  if (window.XMLHttpRequest) { // Mozilla, Safari, IE7+ ...
    var xhr = new XMLHttpRequest();
  } else if (window.ActiveXObject) { // IE 6 and older
    var xhr = new ActiveXObject("Microsoft.XMLHTTP");
  }
  xhr.open('POST', '/home', true);
  xhr.setRequestHeader("Content-Type", "application/json");
  var data = JSON.stringify({activity_mode: activity_mode});
  xhr.send(data);
});

function toggleOn() {
    $('#act_toggle input').prop('checked', true).change();
    console.log('on');
}

function toggleOff() {
    $('#act_toggle input').prop('checked', false).change();
    console.log('off');
}

  if(user.activity_mode){
    toggleOn();
  }else{
    toggleOff();
  }
