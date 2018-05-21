const { ObjectID } = require('mongodb');
const { mongoose } = require('../server/db/mongoose');
const { Todo } = require('../server/modeles/todo');
const { User } = require('../server/modeles/user');

const id = '5b030d6ac8c58110aca27f66';

if (!ObjectID.isValid(id)) {
    return console.log('ID is invalid!');
}

// Todo.find({
//     _id: id
// }).then((todos) => {
//     console.log('Todos', todos)
// });

// Todo.findOne({
//     _id: id
// }).then((todo) => {
//     console.log('Todo', todo)
// });

// Todo.findById(id).then((todo) => {
//     if (!todo) {
//         return console.log('Id not found');
//     }
//     console.log('Todo by Id', todo)
// }).catch((e) => console.log(e));

if (!ObjectID.isValid(id)) {
    return console.log('ID is invalid!');
}

User.findById(id).then((user) => {
    if (!user) {
        return console.log('Id not found');
    }
    console.log('User by Id', user)
}).catch((e) => console.log(e));