var mongoose = require('mongoose');
mongoose.connect("mongodb://localhost/play");
module.exports = mongoose;