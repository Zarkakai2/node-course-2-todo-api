const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');
const { app } = require('../server');
const { Todo } = require('../modeles/todo');
const { User } = require('../modeles/user');
const { populateTodos, todos, populateUsers, users } = require('./seed/seed')

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
    it('should create a new todo', (done) => {
        const text = 'Test todo text';
        request(app)
            .post('/todos')
            .send({ text })
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text)
            }).end((err, res) => {
                if (err) {
                    return done(err);
                }
                Todo.find({ text }).then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((e) => done(e));
            });
    });

    it('should not create todo', (done) => {
        request(app)
            .post('/todos')
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                Todo.find().then((todos) => {
                    expect(todos.length).toBe(2);
                    done();
                }).catch((e) => done(e));
            });
    });
});

describe('GET /todos', () => {
    it('should get all todos', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(2);
            })
            .end(done);
    });
});

describe('GET /todos/:id', () => {
    it('should get a todo', (done) => {
        request(app)
            .get('/todos/' + todos[0]._id)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end(done);
    });

    it('should get a 404 when ID is invalid', (done) => {
        request(app)
            .get('/todos/000')
            .expect(404)
            .end(done);
    });

    it('should get a 404 when no user exists with that ID', (done) => {
        request(app)
            .get('/todos/' + new ObjectID())
            .expect(404)
            .end(done);
    });
});

describe('PATCH /todos/:id', () => {
    it('should update a todo', (done) => {
        const hexId = todos[0]._id.toHexString();
        request(app)
            .patch(`/todos/${hexId}`)
            .send({ completed: true, text: 'a new text' })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id).toBe(hexId);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                Todo.findById(hexId).then((todo) => {
                    expect(todo.completed).toBe(true);
                    expect(todo.text).toBe('a new text');
                    expect(typeof todo.completedAt).toBe('number');
                    done();
                }).catch((error) => {
                    done(error);
                });
            });
    });

    it('should clear completedAt when todo is not completed', (done) => {
        const hexId = todos[1]._id.toHexString();
        request(app)
            .patch(`/todos/${hexId}`)
            .send({ completed: false })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id).toBe(hexId);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                Todo.findById(hexId).then((todo) => {
                    expect(todo.completed).toBe(false);
                    expect(todo.completedAt).toBeFalsy();
                    done();
                }).catch((error) => {
                    done(error);
                });
            });
    });

});

describe('DELETE /todos/:id', () => {
    it('should remove a todo', (done) => {
        const hexId = todos[1]._id.toHexString();
        request(app)
            .delete(`/todos/${hexId}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id).toBe(hexId);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                Todo.findById(hexId).then((todo) => {
                    expect(todo).toBeFalsy();
                    done();
                }).catch((error) => {
                    done(error);
                });
            });
    });

    it('should return 404 if todo not found', (done) => {
        request(app)
            .delete('/todos/000')
            .expect(404)
            .end(done);
    });

    it('should return 404 if object is invalid', (done) => {
        request(app)
            .delete('/todos/' + new ObjectID())
            .expect(404)
            .end(done);
    });
});

describe('GET /users/me', () => {
    it('should return user if authentificated', (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);

            })
            .end(done);
    });

    it('should return 401 if not authentificated', (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth', 'bad_token')
            .expect(401)
            .expect((res) => {
                expect(res.body).toEqual({});
            })
            .end(done);
    });
});

describe('POST /users', () => {
    it('should create a user', (done) => {
        const email = 'example@gmail.com'
        const password = 'password1';
        request(app)
            .post('/users')
            .send({ email, password })
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toBeTruthy();
                expect(res.body._id).toBeTruthy();
                expect(res.body.email).toBe(email);
            })
            .end((err) => {
                if (err) {
                    return done(err);
                }
                User.findOne({ email }).then((user) => {
                    expect(user).toBeTruthy();
                    done();
                });
            });
    });

    it('should return validation errors if request invalid', (done) => {
        const email = 'user1'
        const password = 'password1';
        request(app)
            .post('/users')
            .send({ email, password })
            .expect(400)
            .end(done);
    });

    it('should not create user if email in use', (done) => {
        const email = 'user1@gmail.com'
        const password = 'password1';
        request(app)
            .post('/users')
            .send({ email, password })
            .expect(400)
            .end(done);
    });
});