const {ObjectID} = require('mongodb');
const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server'); 
const {Todo} = require('./../models/todos');


const todos = [
    {
        _id: new ObjectID(), 
        text: "First Test Todo", 
    }, 
    {
        _id: new ObjectID(), 
        text: "Second Test Todo",
        "completed": true, 
        "completedAt" : 333
    }
    ];

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

describe('DELETE /todos/:id', ()=>{
    it('Should remove the todo',  (done)=> {
        var hexid = todos[1]._id.toHexString();

        request(app)
        .delete(`/todos/${hexid}`)
        .expect(200)
        .expect( (res)=> {
            expect(res.body.todo._id).toBe(hexid);
        })
        .end( (err, res)=> {
            if(err){
                return done(err);
            }

            Todo.findById(hexid).then((todo)=>{
                expect(todo).toNotExist();
                done();
            }).catch( (e) => done(e));
        })
    });

    it('should return 404 if the id is not found', (done)=>{
        var hexid = new ObjectID().toHexString();

        request(app)
        .delete(`/todos/${hexid}`)
        .expect(404)
        .end(done);

    });

    it('Should return 404 if the id is invalid', (done)=>{
        request(app)
        .delete(`/todos/123`)
        .expect(404)
        .end(done);
    });
});


describe('PATCH /todos/:id', ()=> {

it('Should update the todo', (done) => {
    var id = todos[0]._id.toHexString();

    request(app)
    .patch(`/todos/${id}`)
    .send({"text": "Updated Text field", "completed": true})
    .expect(200)
    .expect( (res)=>{
        expect(res.body.todo.text).toBe('Updated Text field');
        expect(res.body.todo.completed).toBe(true);
        expect(res.body.todo.completedAt).toBeA('number');
    })
    .end(done);

});

it('Should clear the completedAt if completed is false ', (done)=> {
    var id = todos[1]._id.toHexString();

    request(app)
    .patch(`/todos/${id}`)
    .send({"text": "Updated 2nd Text Field", "completed" : false})
    .expect(200)
    .expect( (res)=> {
        expect(res.body.todo.text).toBe("Updated 2nd Text Field");
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.completedAt).toNotExist();
    })
    .end(done);
});

});