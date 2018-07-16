var express = require('express');

var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var bodyParser = require('body-parser');

var signupController = require('./controllers/signup_controller');
var loginController = require('./controllers/login_controller');
var HomeController = require('./controllers/home_controller');
var profileController = require('./controllers/profile_controller');
var logoutController = require('./controllers/logout_controller');

mongoose.connect('mongodb://localhost:27017/bookshelf').then(function () {
  console.log('connected to database');
});
var db = mongoose.connection;

var app = express();

app.set('view engine', 'ejs');
app.use(express.static('./public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'you-cannot-guess-the-secret-key',
  resave: true,
  saveUninitialized: false,
}));

function requiresLogin(req, res, next){
  if (req.session && req.session.userId) {
    return next();
  }else {
    var error = new Error('You must be logged in to view this page.');
    error.status = 401;
    res.render('login_error', {error: error.message});
  }
}

var server = app.listen(5000, function() {
  console.log('you are listening to port 5000');
});

signupController(app);
loginController(app);
logoutController(app);
HomeController(app, requiresLogin);
profileController(app, requiresLogin);
