var User = require('../models/user');

module.exports = function(app, requiresLogin) {
  app.get('/home', requiresLogin, function(req, res) {
    User.findOne({_id: req.session.userId}).exec(function(err, user) {
      user = JSON.stringify(user);
      res.render('home', {user: user});
    });
  });

  app.post('/home', function(req, res) {
    console.log(req.body);
    User.findOne({_id: req.session.userId}).exec(function(err, user) {
      if(req.body.liked !== undefined){
        updateLike(req.body, user.likes, user._id);
      }
      if(req.body.favourite){
        updateFav(req.body, user.favourites, user._id);
      }
      if(req.body.reading_status){
        updateStatus(req.body.reading_status, user._id);
      }
      if (req.body.shelf) {
        updateShelf(req.body, user.shelf, user._id);
      }
      if(req.body.review){
        updateReview(req.body, user.reviews, user._id);
      }
      if(req.body.ratings){
        updateRating(req.body.ratings, user._id);
      }
      if(req.body.activity_mode != undefined){
        User.updateOne({_id: req.session.userId}, {activity_mode: req.body.activity_mode}).then(function() {
          console.log('activity mode updated');
        });
      }
    });
  });
};

function updateLike(input, user_likes, userId) {
  if(!input.liked){
    var likes = [];
    user_likes.forEach(function(like) {
      if(like.book_id != input.book_id){
        likes.push(like);
      }
    });
  }else{
    var likes = [];
    likes = user_likes;
    likes.push({book_id: input.book_id});
  }
  console.log(likes);
  User.updateOne({_id: userId}, {likes: likes}).then(function() {
    console.log('updated');
  });
  if(input.liked){
    var activity = 'liked';
  }
  else{
    var activity = 'disliked';
  }
  User.findOne({_id: userId}).exec(function(err, user) {
    user.activities.push({book_id: input.book_id, activity: activity});
    User.updateOne({_id: userId}, {activities: user.activities}).then(function() {
      console.log('activity added');
    });
  });
}

function updateFav(input, user_favourites, userId) {
  var favs = [];
  favs = user_favourites;
  favs.push({book_id: input.book_id});
  console.log(favs);
  User.updateOne({_id: userId}, {favourites: favs}).then(function() {
    console.log('updated');
  });
  User.findOne({_id: userId}).exec(function(err, user) {
    user.activities.push({book_id: input.book_id, activity: 'favourite'});
    User.updateOne({_id: userId}, {activities: user.activities}).then(function() {
      console.log('activity added');
    });
  });
}

function updateStatus(input, userId) {
  User.updateOne({_id: userId}, {reading_status: input}).then(function() {
    console.log('updated');
  });
  User.findOne({_id: userId}).exec(function(err, user) {
    user.activities.push({book_id: input[input.length - 1].book_id, activity: 'reading_status', extra_text: input[input.length - 1].status});
    User.updateOne({_id: userId}, {activities: user.activities}).then(function() {
      console.log('activity added');
    });
  });
}

function updateShelf(input, user_shelf, userId){
  var shelf = [];
  shelf = user_shelf;
  shelf.push({book_id: input.book_id});
  User.updateOne({_id: userId}, {shelf: shelf}).then(function() {
    console.log('updated');
  });
  User.findOne({_id: userId}).exec(function(err, user) {
    user.activities.push({book_id: input.book_id, activity: 'shelf'});
    User.updateOne({_id: userId}, {activities: user.activities}).then(function() {
      console.log('activity added');
    });
  });
}

function updateReview(input, user_reviews, userId) {
  user_reviews.push({book_id: input.book_id, text: input.text});
  User.updateOne({_id: userId}, {reviews: user_reviews}).then(function() {
    console.log('updated');
  });
  User.findOne({_id: userId}).exec(function(err, user) {
    user.activities.push({book_id: input.book_id, activity: 'review', extra_text: input.text});
    User.updateOne({_id: userId}, {activities: user.activities}).then(function() {
      console.log('activity added');
    });
  });
}

function updateRating(ratings, userId) {
  User.updateOne({_id: userId}, {ratings: ratings}).then(function() {
    console.log('updated');
  });
  User.findOne({_id: userId}).exec(function(err, user) {
    user.activities.push({book_id: ratings[ratings.length - 1].book_id, activity: 'rated', extra_text: ratings[ratings.length - 1].value});
    User.updateOne({_id: userId}, {activities: user.activities}).then(function() {
      console.log('activity added');
    });
  });
}
