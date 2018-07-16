var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

// var AppointmentSchema = new mongoose.Schema({
//   title: String,
//   description: String,
//   start: String,
//   end: String,
//   date: String,
//   meeting_user: String,
//   accepted: Boolean,
//   rejected: Boolean
// });
//
// var AppointmentRequestSchema = new mongoose.Schema({
//   from_user: String,
//   title: String,
//   start: String,
//   end: String,
//   date: String
// });

var LikesSchema = new mongoose.Schema({
  book_id: String
});

var ReadingStatusSchema = new mongoose.Schema({
  book_id: String,
  status: String
});

var FavouritesSchema = new mongoose.Schema({
  book_id: String
});

var ReviewsSchema = new mongoose.Schema({
  book_id: String,
  text: String
});

var ShelfSchema = new mongoose.Schema({
  book_id: String
});

var RateSchema = new mongoose.Schema({
  book_id: String,
  value: String
});

var ActivitySchema = new mongoose.Schema({
  book_id: String,
  activity: String,
  extra_text: String
});

var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  activity_mode: {
    type: Boolean,
    default: true
  },
  likes: [LikesSchema],
  reading_status: [ReadingStatusSchema],
  favourites: [FavouritesSchema],
  reviews: [ReviewsSchema],
  shelf: [ShelfSchema],
  ratings: [RateSchema],
  activities: [ActivitySchema]
});

UserSchema.pre('save', function(next) {
  var user = this;
  bcrypt.hash(user.password, 10, function(err, hash) {
    if(err){
      return next(err);
    }
    user.password = hash;
    next();
  })
});

UserSchema.statics.authenticate = function(username, password, callback) {
  User.findOne({username: username}).exec(function(err, user) {
    if(err){
      return callback(err);
    }else if(!user){
      var err = new Error('User not found.');
      err.status = 401;
      return callback(err);
    }
    bcrypt.compare(password, user.password, function(err, result) {
      if(result === true){
        return callback(null, user);
      }else{
        return callback();
      }
    });
  });
}

var User = mongoose.model('User', UserSchema);
module.exports = User;
