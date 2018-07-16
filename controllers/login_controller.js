var bodyParser = require('body-parser');
var User = require('../models/user');

var urlencodedParser = bodyParser.urlencoded({extended: false});


module.exports = function(app) {
  app.get('/login', function(req, res) {
    res.render('login', {error: 'no_error'});
  });
  app.post('/login', urlencodedParser, function(req, res) {
    User.authenticate(req.body.username, req.body.password, function(error, user) {
      if(error || !user){
        var err = new Error('Wrong username or password');
        err.status = 401;
        res.render('login', {error: err.message});
      }else{
        req.session.userId = user._id;
        res.redirect('home');
      }
    });
  });
};
