const mongoose =require('mongoose');

 mongoose.Promise = global.Promise //Change Mongoose's Promise with Native Javascript Promise.

 mongoose.connect(process.env.MONGODB_URI);

 module.exports = {mongoose}