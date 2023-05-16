const passport = require('passport'), //Import passport
    LocalStrategy = require('passport-local').Strategy, //Import the LocalStrategy function from passport-local
    Models = require('./models.js'), //Import the models.js file
    passportJWT = require('passport-jwt'); //Import passport-jwt

let Users = Models.User, //Users is a variable that represents the User model
    JWTStrategy = passportJWT.Strategy, //JWTStrategy is a function that allows us to authenticate users using a JWT
    ExtractJWT = passportJWT.ExtractJwt; //ExtractJWT is a function that allows us to extract the JWT from the request

passport.use(new LocalStrategy({
    usernameField: 'Username', //The fields that are used to authenticate the user
    passwordField: 'Password' //The fields that are used to authenticate the user
}, (username, password, callback) => { //The callback function is called when the user is authenticated
    console.log(username + '  ' + password); //Log the username and password to the console;
    Users.findOne({ Username: username }) //took out Password: password to troubleshoot
    .then ((user) => { //Find the user in the database
        console.log("TEST", user);
        /* if (error) { //If there is an error, return it
            console.log(error);
            return callback(error); //If there is an error, return it
        } */

        if (!user) { //If there is no user, return false
            console.log('incorrect username'); //If there is no user, return false
            return callback(null, false, { message: 'Incorrect username or password.' }); // If there is no user, return false
        }

        if (!user.validatePassword(password)) { //If the password is not valid, return false   
            console.log('incorrect password'); //If the password is not valid, return false
            return callback(null, false, { message: 'Incorrect password.' }); // If the password is not valid, return false
        }
        else {
            console.log('finished'); 
            return callback(null, user); //If there is no error, return the user
        }
    });
}));

passport.use(new JWTStrategy({ //Create a new JWTStrategy
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(), //Extract the JWT from the request
    secretOrKey: 'your_jwt_secret' //The secret used to sign the JWT
}, (jwtPayload, callback) => { //The JWT payload is passed into the callback
    return Users.findById(jwtPayload._id) //Find the user in the database
        .then((user) => { //If the user is found, return it
            return callback(null, user); //If the user is not found, return false
        })
        .catch((error) => { 
            return callback(error) //If there is an error, return it
        });
}
));