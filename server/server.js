const express = require('express');
const bodyParser = require('body-parser');
const { mongoose } = require('./db/mongoose');
const { Todo } = require('./modeles/todo');
const { User } = require('./modeles/user');

const app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    var todo = new Todo({
        text: req.body.text
    });
    todo.save().then((doc) => {
        res.send(doc);
    }, (err) => {
        console.log('Error while inserting new Todo', todo, err)
        res.status(400).send(err);
    });
});

app.listen(3000, () => {
    console.log('Started on port 3000')
});