const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');

var data = {
    id: 10
};

var token = jwt.sign(data, 'my_secret_key');
//console.log(token);
var decoded = jwt.verify(token, 'my_secret_key');
//console.log(decoded);


//// Without JWT
// var data = {
//     id: 5
// }

// //encrypt user data in database.
// var token = {
//     data,
//     hash = SHA256(JSON.stringify(data) + 'user_secret_key').toString()
// }

// //user sent data
// var resultHash = SHA256(JSON.stringify(token.data) + 'user_secret_key').toString();

// //Check if the sent data matches the token hash + secret in database
// if(resultHash === token.hash){
//     console.log('Secret Matches! Authentication Passed');
// }else{
//     console.log('Secret Matches! Authentication did not pass!');
// }

