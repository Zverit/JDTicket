var crype = require('crypto');
var util = require('util');
var async = require('async');
var mongoose = require('../lib/mongoose'),
    Schema = mongoose.Schema;

var schema = new Schema({
    login : {
        type : String,
        unique: true,
        required: true
    },
    hashedPassword : {
        type: String,
        required: true
    },
    salt : {
        type: String,
        required: true
    },
    tickets : [String]
});

schema.methods.encryptPassword = function(password){
    return crype.createHmac('sha1', this.salt).update(password).digest('hex');
};

schema.virtual('password').set(function(password){
    this._plainPassword = password;
    this.salt = Math.random() + '';
    this.hashedPassword = this.encryptPassword(password);
}).get(function() { return this._plainPassword});

schema.methods.checkPassword = function(password){
    return this.encryptPassword(password) === this.hashedPassword;
};

schema.statics.autorize = function(login, password, callback){
    var User = this;
    async.waterfall([
        function(callback){
            User.findOne({login :login}, callback);
        },
        function(user, callback){
            if(user){
                if(user.checkPassword(password)){
                    callback(null,user);
                }else{
                    callback(new AuthError("Пароль неверен"));
                    console.log("Пароль неверен");
                }
            }else{
                var user = new User({login: login, password: password})
                user.save(function(err){
                    if(err) return callback(err);
                    callback(null,user);
                });
            }
        }
    ], callback);
};

function AuthError(message) {
    Error.apply(this, arguments);
    Error.captureStackTrace(this, AuthError);

    this.message = message;
}

util.inherits(AuthError, Error);

AuthError.prototype.name = 'AuthError';

exports.User = mongoose.model('User', schema);

exports.AuthError = AuthError;