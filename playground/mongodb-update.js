const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if (err) {
        return console.log('Error connecting to the mongo db server', err);
    }
    const db = client.db('TodoApp');

    db.collection('Todos').findOneAndUpdate({
        text: 'Eat lunch'
    }, {
            $set: {
                completed: true
            }
        }, {
            returnOriginal: false
        }).then((result) => {
            console.log(result);
        });

    db.collection('Users').findOneAndUpdate({
        _id: new ObjectID('5b02e51983ed3c24b0061d9c')
    }, {
            $set: {
                name: 'Aurélien'
            },
            $inc: {
                age: 1
            }
        }, {
            returnOriginal: false
        }).then((result) => {
            console.log(result);
        });

    client.close();
});