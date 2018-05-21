const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if (err) {
        return console.log('Error connecting to the mongo db server', err);
    }
    const db = client.db('TodoApp');

    db.collection('Todos').deleteOne({ text: 'Eat lunch' })
        .then((result) => {
            console.log(result);
        });

    db.collection('Todos').deleteMany({ text: 'Eat lunch' })
        .then((result) => {
            console.log(result);
        });

    db.collection('Todos').findOneAndDelete({ completed: false })
        .then((result) => {
            console.log(result);
        });

    client.close();
});