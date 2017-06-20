const mongoose =require('mongoose');

 mongoose.Promise = global.Promise //Change Mongoose's Promise with Native Javascript Promise.

 mongoose.connect('mongodb://localhost:27017/TodoApp');

 module.exports = {mongoose}