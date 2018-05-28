const { ObjectID } = require('mongodb');
const jwt = require('jsonwebtoken');
const { Todo } = require('../../modeles/todo');
const { User } = require('../../modeles/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const userThreeId = new ObjectID();
const users = [{
    _id: userOneId,
    email: 'user1@gmail.com',
    password: 'passwordUser1',
    tokens: [{
        access: 'auth',
        token: jwt.sign({ _id: userOneId, access: 'auth' }, 'abc123').toString()
    }]
}, {
    _id: userTwoId,
    email: 'user2@gmail.com',
    password: 'passwordUser2'
}, {
    _id: userThreeId,
    email: 'user3@gmail.com',
    password: 'passwordUser3',
    tokens: [{
        access: 'auth',
        token: jwt.sign({ _id: userThreeId, access: 'auth' }, 'abc123').toString()
    }]
}];

const todos = [{
    _id: new ObjectID(),
    text: 'First test todo',
    _creator: userOneId
}, {
    _id: new ObjectID(),
    text: 'Second test todo',
    completed: true,
    completedAt: 333,
    _creator: userOneId
}];

const populateTodos = (done) => {
    Todo.remove({})
        .then(() => { Todo.insertMany(todos) })
        .then(() => done());
};

const populateUsers = (done) => {
    User.remove({})
        .then(() => {
            const userOne = new User(users[0]).save();
            const userTwo = new User(users[1]).save();
            return Promise.all([userOne, userTwo]);
        })
        .then(() => done());
};

module.exports = { populateTodos, todos, populateUsers, users };