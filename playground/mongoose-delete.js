const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todos');
const {User} = require('./../server/models/users');

var id = '59552faac265dc88352e4a51';

//Remove Method - Query todo by anything and remove all the found todos. If no query provided everything will be removed.
// Todo.remove({}).then( (result) => {
//     console.log(result);
// });

//FindOneAndRemove
// Todo.findOneAndRemove({"_id": id}).then( (todo) => {
//     console.log(todo);
// });


//FindByIdAndRemove
// Todo.findByIdAndRemove('59552faac265dc88352e4a52').then( (todo)=> {
//     console.log(todo);
// });
