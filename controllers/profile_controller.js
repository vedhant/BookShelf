var User = require('../models/user');

module.exports = function(app, requiresLogin) {
  app.get('/profile', requiresLogin, function(req, res) {
    User.findOne({_id: req.session.userId}).exec(function(err, user) {
      user = JSON.stringify(user);
      res.render('profile', {user: user});
    });
  });
  app.post('/profile', function(req, res) {
    User.findOne({username: req.body.username}).exec(function(err, user) {
      // console.log(user);
      res.send(user);
    });
  });
}
