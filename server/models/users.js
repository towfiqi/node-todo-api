const validator = require('validator');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcrypt');

//Since we are going to modify this user schema, we are declaring the schema sepoerately, instead of directly declaring it in the model like we did in todos model. 
var UserSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: false, 
        minlength: 1, 
        trim:true
    },
    email: {
        type:String, 
        required: true, 
        minlength: 1, 
        trim:true,
        unique: true,
        validate: {
            isAsync: false,
            validator: validator.isEmail,
            message: "{VALUE} is not a valid email address."
        }, 
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token:{
            type: String,
            required: true
        }
    }]
});

//Modify the default mongoose toJson method to restict the fields to only email, name, id sent to users upon registration.
UserSchema.methods.toJSON = function(){
    var user = this;
    var userObject = user.toObject();

    return _.pick(userObject, ['name', 'email', '_id']);
};


//Create generateAuthToken instance Method to automatically create token and secret on user registration. Not using arrow function becasue we will use `this`
UserSchema.methods.generateAuthToken = function() {
    var user = this; //here this is the single user since we are inside a method
    var access = 'auth'; 
    var token = jwt.sign({_id: user._id.toHexString(), access}, process.env.JWT_SECRET).toString(); //abc123 is the user secret key here.

    user.tokens.push({access, token});

    return user.save().then( () =>{
        return token;
    });
};

// Remove Token instance method.
UserSchema.methods.removeToken = function(token) {
    var user = this;

    return user.update({
        $pull : {
            tokens:{
                token: token
            }
            
        }
    });

};

//User Token verification - create a new model method to find users by token.
UserSchema.statics.findByToken = function(token){
    var User = this;  //here this is the User Model since we are inside an instance
    var decoded;

    try{
        decoded = jwt.verify(token, process.env.JWT_SECRET)
    }catch(e){
        return Promise.reject();
    }
    //If the jwt verification is successful in above try catch error, query the user by token and id and send it with `return`
    return User.findOne( {
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });

};

 //Login by credentials Model Method. Here promise is used to send the rejected error to server.js
UserSchema.statics.findByCredentials = function(email, password){
    var User = this;

    return User.findOne({email}).then((user)=>{
        if(!user){
            return Promise.reject();
        }

        
         return new Promise((resolve, reject)=>{
            bcrypt.compare(password, user.password, (err, res)=>{
                if(res){
                     resolve(user);
                }else{
                     reject();
                }
            });
        });

    });


};


//Hash the User password before the saving the user in database. Since `.pre` is a middleware, we need to use `next`.
UserSchema.pre('save', function(next){
    var user = this;
    //isModified is true when there is no value.
    if(user.isModified('password')){
        bcrypt.genSalt(10, (err, salt)=> {
            bcrypt.hash(user.password, salt, (err, hash)=>{
                user.password = hash;
                next();
            });
        });
    }else{
        next();
    }

});


//User Row
var User = mongoose.model('User', UserSchema);



module.exports = { User };
