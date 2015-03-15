var mongoose = require('mongoose');
//var config = require('config');
mongoose.connect("mongodb://localhost/play");
module.exports = mongoose;