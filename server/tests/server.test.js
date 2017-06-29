const {ObjectID} = require('mongodb');
const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server'); 
const {Todo} = require('./../models/todos');


const todos = [{_id: new ObjectID(), text: "First Test Todo"}, {_id: new ObjectID(), text: "Second Test Todo"}];

//remove all the todos before running each test
beforeEach((done)=> {
    Todo.remove({}).then( ()=> {
        return Todo.insertMany(todos);
    }).then(()=> done());
});

describe('POST / Todos', ()=>{

    it('Should Create a New Todo', (done)=>{
        var text = "Creating a New Todo with Mocha and SuperTest";

        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect( (res)=> {
                expect(res.body.text).toBe(text);
            })
            .end((err, res)=>{
                if(err){
                    return done(err);
                }
        //loop through all the todos in database and check if there is only one todo and data matches the test input
        Todo.find({text}).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((e) => done(e)); 

            });

    });

    it('Should Not pass Empty todo input', (done)=>{
        request(app)
        .post('/todos')
        .send({})
        .expect(400)
        .end((err, res) => {
            if(err){
                return done(err);
            }

            Todo.find().then((todos) => {
                expect(todos.length).toBe(2);
                done();
            }).catch((e)=> done(e));
        });
    });

});


describe('GET /todos', ()=>{
    it('Should get all the todos', (done)=>{
        request(app)
        .get('/todos')
        .expect(200)
        .expect((res) => {
            expect(res.body.todos.length).toBe(2);
        })
        .end( ()=> done());
    });
});

describe('GET /todos/:id', ()=>{

    it('Should return todo document', (done)=> {

        request(app)
        .get(`/todos/${todos[0]._id.toHexString()}`)
        .expect(200)
        .expect( (res)=> {
            expect(res.body.todo.text).toBe(todos[0].text);
        })
        .end( ()=> done());

    });

    it('Should return 404 if id not found', (done)=>{
        var newid = new ObjectID().toHexString();
        request(app)
        .get(`/todos/${newid}`)
        .expect(404)
        .end(done);
    });


    it('Should return 404 if id is a non-object id', (done)=>{
        request(app)
        .get('/todos/123')
        .expect(404)
        .end(done);
    });

});