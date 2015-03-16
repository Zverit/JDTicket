var User = require('../models/user').User;
var async = require('async');
var HttpError = require('../error').HttpError;
var AuthError = require('../models/user').AuthError;
exports.get = function(req, res, next){
    res.render('login');
};

exports.post = function(req, res, next){
    var login = req.body.login;
    var password = req.body.password;

    console.log(login);
    console.log(password);

    User.autorize(login, password, function(err, user){
       if(err){
           if(err instanceof AuthError){
               res.send({});
               return next(new HttpError(403, err.message));
           }
           else{
               return next(err);
           }
       }
        req.session.user = user._id;
        res.send({});
    });
};