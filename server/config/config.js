var env = process.env.NODE_ENV || 'development'; //SET NODE_ENV to development.

console.log('Enviroment *******', env);

if (env === 'development' || env === 'test'){
    var config = require('./config.json');
    var envConfig = config[env]

    Object.keys(envConfig).forEach( (key)=>{
        process.env[key] = envConfig[key];
    });
}