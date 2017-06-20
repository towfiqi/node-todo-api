const express = require('express');
const bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todos');
var {User} = require('./models/users');

var app = express();

//assigning bodyWare.json() middleware which is a function that parses the http body request of express server and combine it with express req
app.use(bodyParser.json());

app.post('/todos', (req, res)=>{
    //console.log(req.body);
    var newTodo = new Todo({text: req.body.text});

    newTodo.save().then((doc)=>{
        res.send(doc);
    }, (err)=>{
        res.status(400).send(err);
    });

});


app.listen(3000, ()=>{
    console.log('Server Running at port 3000');
});

module.exports = {app};