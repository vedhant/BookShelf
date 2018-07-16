var bodyParser = require('body-parser');
var User = require('../models/user');
var request = require('request');

var urlencodedParser = bodyParser.urlencoded({extended: false});

 module.exports = function(app) {
   app.get('/signup', function(req, res) {
     var usernames = [];
     User.find({}).exec(function(err, users) {
       users.forEach(function(user) {
         usernames.push(user.username);
       });
       res.render('signup', {error: false, usernames: usernames});
     });
   });
   app.post('/signup', urlencodedParser, function(req, res, next) {
     if(req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null){

     }else{
       var secretKey = '6Lc_1WEUAAAAANnsAsvfd1R-U2ZR1I128hLh0xOt';
       var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;
       request(verificationUrl, function(error, response, body) {
         body = JSON.parse(body);
         if(body.success !== undefined && !body.success){}else{
           var userData = {
             email: req.body.email,
             username: req.body.username,
             password: req.body.password
           };
           User.create(userData, function(err, user) {
             if(err){
               res.render('signup', {error: true});
             }
             else{
               return res.redirect('/login');
             }
           });
         }
       });
     }

   });
 };
