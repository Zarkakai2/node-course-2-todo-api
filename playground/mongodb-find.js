const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if (err) {
        return console.log('Error connecting to the mongo db server', err);
    }
    const db = client.db('TodoApp');

    db.collection('Todos').find({ _id: new ObjectID('5b02e3433f5d4c2410c61ac9') }).toArray()
        .then((docs) => {
            console.log('Todos');
            console.log(JSON.stringify(docs, undefined, 2));
        }, (err) => {
            console.log('Error while fetching todos', err);
        });

    db.collection('Todos').find().count()
        .then((count) => {
            console.log(`There are ${count} Todos`);
        }, (err) => {
            console.log('Error while fetching todos', err);
        });

    var nameFetched = 'Aurelien';
    db.collection('Users').find({
        name: nameFetched
    }).count()
        .then((count) => {
            console.log(`There are ${count} users called ${nameFetched}`);
        }, (err) => {
            console.log('Error while fetching todos', err);
        });

    client.close();
});