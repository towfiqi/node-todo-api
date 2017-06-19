const {MongoClient, ObjectID} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db)=>{

    if(err){
        return console.log('Couldnt Connect to Server');
    }

    console.log('Successfully Connected to the Server');

    db.collection('Users').find({name: 'Towfiq'}).toArray().then((docs)=>{
        console.log(JSON.stringify(docs, undefined, 2));
    }, (err) =>{
        console.log('Unable to Find Query');
    });

    db.collection('Users').find().count().then((count)=>{
        console.log('Total Users:', count)
    }, (err)=>{
        console.log('Operation Unsuccessful.');
    });



    //db.close();

});