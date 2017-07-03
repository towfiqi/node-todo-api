var {User} = require('./../models/users.js');

var authenticate = (req, res, next) => {
    var token  = req.header('x-auth'); //get the token of the current request

    //Find the user by the token we got from the custom x-auth header
    User.findByToken(token).then( (user)=> {
        if(!user){
            return Promise.reject();
        }

        //Modify the current request to add the found user and x-auth token to the request so that the routes can use them (in server.js)
        req.user = user;
        req.token = token;

        next();

    }).catch( (e)=> {
        res.status(401).send();
    });
};

module.exports = {authenticate};