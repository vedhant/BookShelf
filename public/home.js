document.querySelectorAll('#main-nav ul li')[0].querySelector('a').classList.add('active');

var user = document.querySelector('#user').innerHTML;
user = JSON.parse(user);



var modal_book_model = document.querySelector('#modal_book');
var temp = document.createElement('div');
temp.appendChild(modal_book_model);
modal_book_model = temp.innerHTML;
temp.innerHTML = '';
var book_model = document.querySelector('#book_model');
temp.appendChild(book_model);
book_model = temp.innerHTML;
temp.innerHTML = '';

document.querySelector('#search_form').addEventListener('submit', function(e) {
  e.preventDefault();
  var search_text = document.querySelector('#search_form input').value;
  search_text = search_text.replace(/\s+/g, '%20');
  var search_by_input = document.querySelectorAll('#search_form select option');
  var search_by = null;
  search_by_input.forEach(function(s) {
    if(s.selected){
      search_by = s.value;
    }
  });
  var return_books = function (books_raw){
    var books = [];
    if(books_raw){
      books_raw.items.forEach(function(book) {
        books.push(book);
      });
    }
    display_books(books);
  };
  get_books(search_by, search_text, return_books);
  $('#modal_search').modal('hide');
});

document.querySelector('#modal_search .modal-content').innerHTML = '';

var search_textfield = document.querySelector('#search_form input');

var position_modal_done = false;
function position_modal() {
  if(position_modal_done){
    return;
  }
  position_modal_done = true;
  var rect = search_textfield.getBoundingClientRect();
  var modal = document.querySelector('#modal_search .modal-content');
  var modal_rect = modal.getBoundingClientRect();
  modal.style.position = 'absolute';
  modal.style.width = rect.width+'px';
  modal.style.left = rect.left - modal_rect.left + 'px';
  modal.style.top = rect.top + rect.height + 'px';
}

search_textfield.addEventListener('focus', function(e) {
  var options = {
  'backdrop' : true,
  'focus' : false
}
  $('#modal_search').modal(options);
  $('#modal_search').on('shown.bs.modal', function() {
    position_modal();
  });
});

search_textfield.addEventListener('keyup', function(e) {
  var search_text = e.target.value;
  var search_by_input = document.querySelectorAll('#search_form select option');
  var search_by = null;
  search_by_input.forEach(function(s) {
    if(s.selected){
      search_by = s.value;
    }
  });
  var return_books = function (books_raw){
    var books = [];
    if(books_raw){
      books_raw.items.forEach(function(book) {
        books.push(book);
      });
    }
    live_search_results(books);
  };
  get_books(search_by, search_text, return_books);

});


function get_books(search_by, search_text, return_books) {
  if (window.XMLHttpRequest) { // Mozilla, Safari, IE7+ ...
    var xhr = new XMLHttpRequest();
  } else if (window.ActiveXObject) { // IE 6 and older
    var xhr = new ActiveXObject("Microsoft.XMLHTTP");
  }
  url = 'https://www.googleapis.com/books/v1/volumes?q=' + search_by + ':' + search_text + '&key=AIzaSyDlb433NFdDrzlqiQ73rKNEi8VPh4x8fZo';
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

function live_search_results(books) {
  var modal_block = document.querySelector('#modal_search .modal-content');
  modal_block.innerHTML = '';
  if(books){
    books.forEach(function(book) {
      var modal_book = modal_book_model;
      var temp = document.createElement('div');
      temp.innerHTML = modal_book;
      modal_book = temp.childNodes[0];
      modal_book.querySelector('img').setAttribute('src', book.volumeInfo.imageLinks.thumbnail);
      modal_book.querySelector('h6').innerHTML = book.volumeInfo.title;
      var authors = book.volumeInfo.authors;
      if(authors){
        modal_book.querySelector('h7').innerHTML = '- ';
        for(var i=0; i<authors.length; ++i){
          if(i==authors.length-1){
            modal_book.querySelector('h7').innerHTML += authors[i];
          }else{
            modal_book.querySelector('h7').innerHTML += authors[i]+', ';
          }
        }
      }
      modal_block.appendChild(modal_book);
    });
  }
}

function display_books(books) {
  var block = document.querySelector('#block');
  block.innerHTML = '';
  if(books){
    books.forEach(function(book) {
      var display_book = book_model;
      var temp = document.createElement('div');
      temp.innerHTML = display_book;
      display_book = temp.childNodes[0];
      display_book.setAttribute('id', book.id);
      display_book.querySelector('img').setAttribute('src', book.volumeInfo.imageLinks.thumbnail);
      display_book.querySelector('.card-title').innerHTML = book.volumeInfo.title;
      var authors = book.volumeInfo.authors;
      if(authors){
        display_book.querySelector('.card-subtitle').innerHTML = '- ';
        for(var i=0; i<authors.length; ++i){
          if(i==authors.length-1){
            display_book.querySelector('.card-subtitle').innerHTML += authors[i];
          }else{
            display_book.querySelector('.card-subtitle').innerHTML += authors[i]+', ';
          }
        }
      }
      if(user.likes){
        display_like = display_book.querySelector('.fa-thumbs-up');
        user.likes.forEach(function(like) {
          if(like.book_id == book.id){
            display_like.classList.toggle("fa-thumbs-down");
          }
        });
      }
      if(user.favourites){
        display_fav = display_book.querySelector('#fav');
        user.favourites.forEach(function(fav) {
          if(fav.book_id == book.id){
            display_fav.classList.add('disabled');
          }
        });
      }
      if(user.shelf){
        display_shelf = display_book.querySelector('#add_to_shelf');
        user.shelf.forEach(function(s) {
          if(s.book_id == book.id){
            display_shelf.classList.add('disabled');
          }
        });
      }
      if(user.reading_status){
        display_status = display_book.querySelector('#reading_status');
        user.reading_status.forEach(function(status) {
          if(status.book_id == book.id){
            for(var i=0; i<3; ++i){
              if(status.status == display_status.childNodes[2*i+3].value){
                display_status.childNodes[2*i+3].setAttribute('selected', 'selected');
              }
            }
          }
        });
      }
      if(user.ratings){
        var spans = display_book.querySelectorAll('.fa-star');
        user.ratings.forEach(function(rating) {
          if(rating.book_id == book.id){
            for(var i=0; i<rating.value; ++i){
              spans[i].style.color = '#f1c40f';
            }
            for(; i<spans.length; ++i){
              spans[i].style.color = 'black';
            }
          }
        });
      }
      if(book.volumeInfo.averageRating){
        display_book.querySelector('.progress-bar').style.width = book.volumeInfo.averageRating*20 + '%';
      }
      display_book.querySelector('.card-text').innerHTML = book.volumeInfo.description;
      block.appendChild(display_book);
    });
  }
}

document.querySelector('#block').addEventListener('click', function(e) {
  var parent = e.target;
  while(parent.className != 'col-lg-6 card'){
    parent = parent.parentElement;
  }
  var book_id = parent.id;
  if(e.target.id === 'like'){
    Like(e.target, book_id);
  }
  else if(e.target.id === 'fav'){
    if(e.target.classList.value == 'btn btn-outline-dark'){
      Favourite(e.target, book_id);
    }
  }else if(e.target.id === 'reading_status'){
    var sel = e.target;
    var value = sel.options[sel.selectedIndex].value;
    var update = true;
    if(value == 'Reading status'){
      update = false;
    }
    user.reading_status.forEach(function(status) {
      if(book_id == status.book_id && status.status == value){
        update = false;
      }
    });
    if(update){
      var temp_status = [];
      user.reading_status.forEach(function(status) {
        if(book_id != status.book_id){
          temp_status.push(status);
        }
      });
      user.reading_status = temp_status;
      user.reading_status.push({book_id: book_id, status: value});
      if (window.XMLHttpRequest) { // Mozilla, Safari, IE7+ ...
        var xhr = new XMLHttpRequest();
      } else if (window.ActiveXObject) { // IE 6 and older
        var xhr = new ActiveXObject("Microsoft.XMLHTTP");
      }
      xhr.open('POST', '/home', true);
      xhr.setRequestHeader("Content-Type", "application/json");
      var data = JSON.stringify({reading_status: user.reading_status});
      xhr.send(data);
    }
  }else if (e.target.id == 'add_to_shelf') {
    if(e.target.classList.value == 'btn'){
      Shelf(e.target, book_id);
    }
  }
  else if(e.target.id == 'add_review'){
    var review = parent.querySelector('textarea').value;
    Review(e.target, book_id, review);
  }
  else if(e.target.classList.value == 'fa fa-star'){
    var rating = e.target.id;
    var spans = parent.querySelectorAll('.fa-star');
    for(var i=0; i<rating; ++i){
      spans[i].style.color = '#f1c40f';
    }
    for(; i<spans.length; ++i){
      spans[i].style.color = 'black';
    }
    Rate(e.target, book_id, rating);
  }
});

function Like(i, id) {
  i.classList.toggle("fa-thumbs-down");
  if(i.classList.value === 'fa fa-thumbs-up'){
    var liked = false;
  }
  else{
    var liked = true;
  }
  if (window.XMLHttpRequest) { // Mozilla, Safari, IE7+ ...
    var xhr = new XMLHttpRequest();
  } else if (window.ActiveXObject) { // IE 6 and older
    var xhr = new ActiveXObject("Microsoft.XMLHTTP");
  }
  xhr.open('POST', '/home', true);
  xhr.setRequestHeader("Content-Type", "application/json");
  var data = JSON.stringify({book_id: id, liked: liked});
  xhr.send(data);
}

function Favourite(button, id) {
  button.classList.add('disabled');
  if (window.XMLHttpRequest) { // Mozilla, Safari, IE7+ ...
    var xhr = new XMLHttpRequest();
  } else if (window.ActiveXObject) { // IE 6 and older
    var xhr = new ActiveXObject("Microsoft.XMLHTTP");
  }
  xhr.open('POST', '/home', true);
  xhr.setRequestHeader("Content-Type", "application/json");
  var data = JSON.stringify({book_id: id, favourite: true});
  xhr.send(data);
}

function Shelf(button, id) {
  button.classList.add('disabled');
  if (window.XMLHttpRequest) { // Mozilla, Safari, IE7+ ...
    var xhr = new XMLHttpRequest();
  } else if (window.ActiveXObject) { // IE 6 and older
    var xhr = new ActiveXObject("Microsoft.XMLHTTP");
  }
  xhr.open('POST', '/home', true);
  xhr.setRequestHeader("Content-Type", "application/json");
  var data = JSON.stringify({book_id: id, shelf: true});
  xhr.send(data);
}

function Review(button, id, text) {
  if (window.XMLHttpRequest) { // Mozilla, Safari, IE7+ ...
    var xhr = new XMLHttpRequest();
  } else if (window.ActiveXObject) { // IE 6 and older
    var xhr = new ActiveXObject("Microsoft.XMLHTTP");
  }
  xhr.open('POST', '/home', true);
  xhr.setRequestHeader("Content-Type", "application/json");
  var data = JSON.stringify({book_id: id, review: true, text: text});
  xhr.send(data);
}

function Rate(span, id, rating) {
  var rating_added = false;
  if(user.ratings){
    for(var i=0; i<user.ratings.length; ++i){
      if(id == user.ratings[i].book_id){
        user.ratings[i].value = rating;
        rating_added = true;
      }
    }
    if(!rating_added){
      user.ratings.push({book_id: id, value: rating});
    }
  }else{
    user.ratings = [];
    user.ratings.push({book_id: id, value: rating});
  }
  if (window.XMLHttpRequest) { // Mozilla, Safari, IE7+ ...
    var xhr = new XMLHttpRequest();
  } else if (window.ActiveXObject) { // IE 6 and older
    var xhr = new ActiveXObject("Microsoft.XMLHTTP");
  }
  xhr.open('POST', '/home', true);
  xhr.setRequestHeader("Content-Type", "application/json");
  var data = JSON.stringify({ratings: user.ratings});
  xhr.send(data);
}

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
