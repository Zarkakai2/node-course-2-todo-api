const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');
const _ = require('lodash');
const { mongoose } = require('./db/mongoose');
const { Todo } = require('./modeles/todo');
const { User } = require('./modeles/user');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    var todo = new Todo({
        text: req.body.text
    });
    todo.save().then((doc) => {
        res.send(doc);
    }, (err) => {
        res.status(400).send(err);
    });
});

app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({ todos });
    }, (err) => {
        res.status(400).send(err);
    });
});

app.get('/todos/:id', (req, res) => {
    const id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send({ error: 'Invalid ID.' });
    }
    Todo.findById(id).then((todo) => {
        if (!todo) {
            return res.status(404).send({ error: 'No TODO with that ID.' });
        }
        res.send({ todo });
    }, (err) => {
        res.status(400).send(err);
    });
});

app.delete('/todos/:id', (req, res) => {
    const id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send({ error: 'Invalid ID.' });
    }
    Todo.findByIdAndRemove(id).then((todo) => {
        if (todo) {
            return res.send({ todo });
        }
        return res.status(404).send({ error: 'No TODO with that ID.' });
    });
});

app.patch('/todos/:id', (req, res) => {
    const id = req.params.id;
    const body = _.pick(req.body, ['text', 'completed']);
    if (!ObjectID.isValid(id)) {
        return res.status(404).send({ error: 'Invalid ID.' });
    }
    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }
    Todo.findByIdAndUpdate(id, { $set: body }, { new: true }).then((todo) => {
        if (!todo) {
            return res.status(404).send({ error: 'No TODO with that ID.' });
        }
        res.send({ todo });
    }).catch((err) => {
        res.status(400).send(err);
    });
});

app.post('/users', (req, res) => {
    const body = _.pick(req.body, ['email', 'password']);
    var user = new User({ email: body.email, password: body.password });

    user.save().then(() => {
        return user.generateAuthToken();
    }).then((token) => {
        res.header('x-auth', token).send(user);
    }).catch((err) => {
        res.status(400).send(err);
    });
});

app.listen(port, () => {
    console.log('Started on port ' + port)
});

module.exports = { app };