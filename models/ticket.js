var mongoose = require('../lib/mongoose'),
    Schema = mongoose.Schema;

var schema = new Schema({
     from : {
        type : String,
        required: true
     },
     to : {
        type : String,
        required: true
     },
    date:{
        type: String,
        required: true
    },
    count : {
        type: Number,
        required: true
    }
});

exports.Ticket = mongoose.model('Ticket', schema);
