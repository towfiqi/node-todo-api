const {MongoClient, ObjectID} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db)=>{

    if(err){
        return console.log('Couldnt Connect to Server');
    }

    console.log('Successfully Connected to the Server');

    //deleteOne Method
    // db.collection('Todos').deleteOne({text: 'Eat lucnh'}).then((result)=>{
    //     console.log(result);
    // });

    //deleteMany Method
    // db.collection('Todos').deleteMany({text: "Eat lucnh"}).then((result)=>{
    //     console.log(result);
    // });
    // db.collection('Users').deleteMany({name: "Towfiq"}).then((result)=>{
    //     console.log(result);
    // });


    //findOneAndDelete Method
    // db.collection('Todos').findOneAndDelete({text: "Eat lunch"}).then((result)=>{
    //     console.log(result);
    // });
    db.collection('Users').findOneAndDelete({_id: new ObjectID('59476c5cbde0262bcd01bd2a')}).then((result)=>{
        console.log(result);
    });



    //db.close();

});