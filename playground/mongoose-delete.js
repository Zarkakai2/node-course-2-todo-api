const { ObjectID } = require('mongodb');
const { mongoose } = require('../server/db/mongoose');
const { Todo } = require('../server/modeles/todo');
const { User } = require('../server/modeles/user');

// Todo.remove({}).then((result) => {
//     console.log(result);
// });

Todo.findByIdAndRemove('5b09d59d2f6461d8c4d3c7cb').then((todo) => {
    console.log(todo);
});

// Todo.findOneAndRemove({ _id: '5b09d59d2f6461d8c4d3c7cb' }).then((todo) => {
//     console.log(todo);
// });