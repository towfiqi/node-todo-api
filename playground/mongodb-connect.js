const {MongoClient, ObjectID} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db)=>{

    if(err){
        return console.log('Couldnt Connect to Server');
    }

    console.log('Successfully Connected to the Server');

    // db.collection('Todos').insertOne({
    //     text: "My New Todo Item",
    //     completed: false
    // }, (err, result) => {
    //     if(err){
    //         return console.log('Unable to Insert Todo item', err);
    //     }

    //     console.log( JSON.stringify(result.ops, undefined, 2));
        
    // });

    db.collection('Users').insertOne({
        name: 'Towfiq',
        age: 32,
        location: 'Bangladesh'
    }, (err, result)=> {
        if(err){
            return console.log('Unable to add new User', err);
        }

        console.log(JSON.stringify(result.ops, undefined, 2));
    });


    db.close();

});