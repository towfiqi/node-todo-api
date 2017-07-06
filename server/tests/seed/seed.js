const {ObjectID} = require('mongodb');
const {User} = require('./../../models/users.js');
const {Todo} = require('./../../models/todos.js');
const jwt = require('jsonwebtoken');

var userOneID = new ObjectID();
var userTwoID = new ObjectID();

const todos = [
    {
        _id: new ObjectID(), 
        text: "First Test Todo", 
        _creator: userOneID
    }, 
    {
        _id: new ObjectID(), 
        text: "Second Test Todo",
        "completed": true, 
        "completedAt" : 333,
        _creator: userTwoID
    }
];


const users = [
    {
        _id: userOneID,
        email: 'tislam100@gmail.com',
        password: 'userOnepassword',
        name: 'Towfiq',
        tokens: [{
            token: jwt.sign({_id: userOneID, access:'auth'}, 'abc123').toString(),
            access: 'auth',
        }]
    },
    {
        _id: userTwoID,
        email:'tislam101@gmail.com',
        password: 'userTwopassword',
        name: 'Towfiqul',
        tokens: [{
            token: jwt.sign({_id: userTwoID, access:'auth'}, 'abc123').toString(),
            access: 'auth',
        }]
    }

];


const populateTodos = (done)=> {
    Todo.remove({}).then( ()=> {
        return Todo.insertMany(todos);
    }).then(()=> done());
}

const populateUsers = (done) => {
    User.remove({}).then(()=> {
        var userOne = new User(users[0]).save();
        var userTwo = new User(users[1]).save();

        return Promise.all([userOne, userTwo]);
    }).then( () => done());
}

module.exports = {todos, populateTodos, users, populateUsers};
