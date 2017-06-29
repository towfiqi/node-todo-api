const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todos');
const {User} = require('./../server/models/users');

var id = '59550d796333b4959c8d338e';
var userid = '5948d189030ef3dc856d1562';

if(!ObjectID.isValid(id)){
    console.log('Invalid ID!');
}
//find method
Todo.find({_id: id}).then( (todos)=> {
    console.log('The Todos:', todos);
});

//findOne method - returns the first query result
Todo.findOne({_id : id}).then( (todo)=> {
    console.log('The Todo:', todo);
});

//findById method - returns documents by their id
Todo.findById(id).then( (todo)=> {
    if(!todo) {
        return console.log('ID not found!');
    }
    console.log('Find By Id:', todo);

}).catch( (e)=> console.log(e));


User.findById(userid).then( (user)=> {
    if(!user){
        return console.log('No User found');
    }
    console.log('User:', user);
}).catch( (e) => console.log(e))