const {ObjectID} = require('mongodb');
const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server'); 
const {Todo} = require('./../models/todos');
const {User} = require('./../models/users');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');


//Before running the tests, remove all the todos,users and populate thhem with seed data
beforeEach(populateTodos);
beforeEach(populateUsers);

describe('POST / Todos', ()=>{

    it('Should Create a New Todo', (done)=>{
        var text = "Creating a New Todo with Mocha and SuperTest";

        request(app)
            .post('/todos')
            .set('x-auth', users[0].tokens[0].token)
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
        .set('x-auth', users[0].tokens[0].token)
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
        .set('x-auth', users[0].tokens[0].token)
        .expect(200)
        .expect((res) => {
            expect(res.body.todos.length).toBe(1);
        })
        .end(done);
    });
});

describe('GET /todos/:id', ()=>{

    it('Should return todo document', (done)=> {

        request(app)
        .get(`/todos/${todos[0]._id.toHexString()}`)
        .set('x-auth', users[0].tokens[0].token)
        .expect(200)
        .expect( (res)=> {
            expect(res.body.todo.text).toBe(todos[0].text);
        })
        .end( ()=> done());

    });

    it('Should not reuturn another users todo item', (done)=>{
        request(app)
        .get(`/todos/${todos[1]._id.toHexString()}`)
        .set('x-auth', users[0].tokens[0].token)
        .expect(404)
        .end(done);
    });

    it('Should return 404 if id not found', (done)=>{
        var newid = new ObjectID().toHexString();
        request(app)
        .get(`/todos/${newid}`)
        .set('x-auth', users[0].tokens[0].token)
        .expect(404)
        .end(done);
    });


    it('Should return 404 if id is a non-object id', (done)=>{
        request(app)
        .get('/todos/123')
        .set('x-auth', users[0].tokens[0].token)
        .expect(404)
        .end(done);
    });

});

describe('DELETE /todos/:id', ()=>{
    it('Should remove the todo',  (done)=> {
        var hexid = todos[1]._id.toHexString();

        request(app)
        .delete(`/todos/${hexid}`)
        .set('x-auth', users[1].tokens[0].token)
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

    it('Should not remove other users todos',  (done)=> {
        var hexid = todos[0]._id.toHexString();

        request(app)
        .delete(`/todos/${hexid}`)
        .set('x-auth', users[1].tokens[0].token)
        .expect(404)
        .end( (err, res)=> {
            if(err){
                return done(err);
            }

            Todo.findById(hexid).then((todo)=>{
                expect(todo).toExist();
                done();
            }).catch( (e) => done(e));
        })
    });

    it('should return 404 if the id is not found', (done)=>{
        var hexid = new ObjectID().toHexString();

        request(app)
        .delete(`/todos/${hexid}`)
        .set('x-auth', users[0].tokens[0].token)
        .expect(404)
        .end(done);

    });

    it('Should return 404 if the id is invalid', (done)=>{
        request(app)
        .delete(`/todos/123`)
        .set('x-auth', users[0].tokens[0].token)
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
        .set('x-auth', users[0].tokens[0].token)
        .expect(200)
        .expect( (res)=>{
            expect(res.body.todo.text).toBe('Updated Text field');
            expect(res.body.todo.completed).toBe(true);
            expect(res.body.todo.completedAt).toBeA('number');
        })
        .end(done);

    });

    it('Should not update other users todo', (done) => {
        var id = todos[0]._id.toHexString();

        request(app)
        .patch(`/todos/${id}`)
        .send({"text": "Updated Text field", "completed": true})
        .set('x-auth', users[1].tokens[0].token)
        .expect(404)
        .end(done);

    });

    it('Should clear the completedAt if completed is false ', (done)=> {
        var id = todos[1]._id.toHexString();

        request(app)
        .patch(`/todos/${id}`)
        .set('x-auth', users[1].tokens[0].token)
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


describe('POST /users/me', ()=> {

    it('Should return user if authenticated', (done)=> {

        request(app)
        .get('/users/me')
        .set('x-auth', users[0].tokens[0].token)
        .expect(200)
        .expect((res)=> {
            expect(res.body._id).toBe(users[0]._id.toHexString());
            expect(res.body.email).toBe(users[0].email);
        })
        .end(done);
    });

    it('should return 401 when user is not authenticated', (done)=> {

        request(app)
        .get('/users/me')
        .expect(401)
        .expect( (res)=>{
            expect(res.body).toEqual({});
        })
        .end(done);
    });

});

describe('POST /users', ()=> {

    it('should create a user', (done)=> {
        var name = "Test";
        var email = 'towfiqtab@gmail.com';
        var password = 'abc123';

        request(app)
        .post('/users')
        .send({name, email, password})
        .expect(200)
        .expect((res)=> {
            expect(res.headers['x-auth']).toExist();
            expect(res.body._id).toExist();
            expect(res.body.email).toBe(email);
        })
        .end( (err)=> {
            if(err){
                return done(err);
            }

            User.findOne({email}).then( (user)=> {
                expect(user).toExist();
                expect(user.password).toNotBe(password);
                done();
            });
        });

    });

    it('should return 400 when invalid email and password supplied', (done)=>{
        var name = "Test";
        var email = 'abc12';
        var password = '123';

        request(app)
        .post('/users')
        .send({name, email, password})
        .expect(400)
        .end(done);

    });

    it('should return 400 when existing email used to create account', (done)=>{
        request(app)
        .post('/users')
        .send({"email": users[0].email, "password":"Password123"})
        .expect(400)
        .end(done);

    });

});

describe('POST /users/login', ()=> {

    it('should login user and return the auth token', (done)=>{
        request(app)
        .post('/users/login')
        .send({email: users[1].email, password: users[1].password, })
        .expect(200)
        .expect( (res)=> {
            expect(res.headers['x-auth']).toExist();
        })
        .end( (err, res)=> {
            if(err){
                return done(err);
            }

            User.findById(users[1]._id).then( (user)=> {
                expect(user.tokens[1]).toInclude({
                    access: 'auth',
                    token: res.headers['x-auth']
                });

                done();
            }).catch( (e)=> {
                done(e);
            });

        });
    });

    it('should reject invalid login', (done)=>{
        request(app)
        .post('/users/login')
        .send({email: users[1].email, password: "123"})
        .expect(400)
        .expect( (res)=> {
            expect(res.headers['x-auth']).toNotExist();
        })
        .end( (err)=> {
            if(err){
               return done(err);
            }

            User.findById(users[1]._id).then( (user)=>{
                expect(user.tokens.length).toBe(1);
                done();
            }).catch( (e)=> {
            done(e);
        });

        });
    });

});


describe('DELETE /users/me/token',  ()=> {

    it('Should remove the token on logout', (done)=> {
        request(app)
        .delete('/users/me/token')
        .set('x-auth',users[0].tokens[0].token)
        .expect(200)
        .end( (err, res)=> {
            if(err){
                done(err);
            }

            User.findById(users[0]._id).then((user)=> {
                expect(user.tokens.length).toBe(0);
                done();
            }).catch((e)=> {
                done(e);
            });

        });
    });

});
