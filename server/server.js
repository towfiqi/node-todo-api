require('./config/config.js');
const _ = require('lodash');
const {ObjectID} = require('mongodb');
const express = require('express');
const bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todos');
var {User} = require('./models/users');
var {authenticate} = require('./middleware/authenticate');
var bcrypt = require('bcrypt');

var app = express();

var port = process.env.PORT;

//assigning bodyWare.json() middleware which is a function that parses the http body request of express server and combine it with express req
app.use(bodyParser.json());

app.post('/todos', (req, res)=>{
    //console.log(req.body);
    var newTodo = new Todo({text: req.body.text});
    //mongodb command to save the new todo
    newTodo.save().then((doc)=>{
        res.send(doc);
    }, (err)=>{
        res.status(400).send(err);
    });

});

app.get('/todos', (req, res)=>{
    //mongodb command to get all todos
    Todo.find().then((todos) =>{
        res.send({todos});
    }, (err)=>{
        res.status(400).send(err);
    });

});

app.get('/todos/:id', (req, res)=>{
    var id = req.params.id;

    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }

    Todo.findById(id).then( (todo)=> {
        if(!todo){
            return res.status(404).send();
        }

        res.status(200).send({todo});

    }, (err) => {
        res.status(404).send()
    });

});

app.delete('/todos/:id', (req, res) => {
    var id = req.params.id;

    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    };

    Todo.findByIdAndRemove(id).then( (todo) => {
        if(!todo) {
            return res.status(404).send();
        }

        res.status(200).send({todo});

    }, (err) => {
        res.send(404).send();
    });

});

app.patch('/todos/:id', (req, res)=>{
    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']); //Only pick the text and completed field from the user's api request

    //check if the id is a valid object id
    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }

    //If completed value is send as true, set the completedAt to current time.
    if(_.isBoolean(body.completed) && body.completed){
        body.completedAt = new Date().getTime();
    }else{
        body.completed = false;
        body.completedAt = null;

    }

    Todo.findByIdAndUpdate(id, {$set: body} , {new: true} ).then( (todo)=> {
        if(!todo){
            return res.status(404).send();
        }
        res.status(200).send({todo});
    }, (err)=> {
        return res.status(404).send();
    });

});

//Create New User
app.post('/users', (req, res)=>{
    
    var body = _.pick(req.body, ['name','email','password']);
    var newUser = new User(body);

    newUser.save().then( ()=> {
        return newUser.generateAuthToken();
    }).then( (token)=> {
        res.header('x-auth', token).send(newUser); 
    }).catch((err)=> {
        res.status(400).send(err);
    });

});


app.get('/users/me', authenticate, (req, res)=> {
    res.send(req.user);
});

app.post('/users/login', (req, res)=>{
    var body = _.pick(req.body, ['email', 'password']);
    //res.send(body);
    
    User.findByCredentials(body.email, body.password).then((user)=>{
        return user.generateAuthToken().then( (token)=>{
            res.header('x-auth', token).send(user);
        });
    }).catch((e)=> {
        res.status(400).send();
    });


});

//Delete user generated token on logout. The authenticate middleware was used to access the user's token
app.delete('/users/me/token', authenticate, (req, res) =>{
    var user = req.user;

    user.removeToken(req.token).then(()=> {
        res.status(200).send();
    }).catch( (e)=> {
        res.send(400).send();
    });


});


app.listen(port, ()=>{
    console.log(`Server Running at port ${port}`);
});

module.exports = {app};