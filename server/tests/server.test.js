const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server'); 
const {Todo} = require('./../models/todos');


const todos = [{text: "First Test Todo"}, {text: "Second Test Todo"}];

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
    it('Should get all the todos', ()=>{
        request(app)
        .get('/todos')
        .expect(200)
        .expect((res) => {
            expect(res.body.todos.length).toBe(2);
        })
        .end( ()=> done())
    });
});