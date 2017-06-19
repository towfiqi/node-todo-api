const {MongoClient, ObjectID} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db)=>{

    if(err){
        return console.log('Couldnt Connect to Server');
    }

    console.log('Successfully Connected to the Server');

    // db.collection('Todos').findOneAndUpdate(
    //     {_id: new ObjectID('59479c6094a992ca0545f903')},
    //     {$set: {completed:true}},
    //     {returnOriginal:false})
    //     .then( (results)=> {
    //         console.log(results);
    // });


    db.collection('Users').findOneAndUpdate(
        {
            name: 'Towfiq'}, 
        {
            $inc: {age: -28}, 
            $set:{name: 'Towfiq'} 
        }, 
        {
            returnOriginal: false
        }).then( (results)=> {
            console.log(results);
        });


    //db.close();

});