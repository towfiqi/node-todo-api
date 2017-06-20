const mongoose = require('mongoose');

//User Row
var User = mongoose.model('User', {
    name: {type: String, required: true, minlength: 1, trim:true},
    email: {type:String, required: true, minlength: 1, trim:true}
});

module.exports = { User }
