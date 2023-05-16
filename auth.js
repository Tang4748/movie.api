const jwtSecret = 'your_jwt_secret'; // This has to be the same key used in the JWTStrategy

const jwt = require('jsonwebtoken'), // Import the jsonwebtoken package
    passport = require('passport'); // Import passport

require('./passport'); // Import local passport file

let generateJWTToken = (user) => { // Create a function that generates a JWT
    return jwt.sign(user, jwtSecret, { // Sign the JWT with the user's username and password
        subject: user.Username, // The subject of the JWT is the username
        expiresIn: '10d', // The JWT expires in 10 days
        algorithm: 'HS256' // The algorithm used to sign the JWT
    });
}

// POST login
module.exports = (router) => {
    router.post('/login', (req, res) => { //When a POST request is made to the /login endpoint
      passport.authenticate('local', { session: false }, (info, user, error) => { //Authenticate the user using the local strategy
        console.log(user, error, info);
        if (error || !user) { //If there is an error or the user is not found
          return res.status(400).json({ //Return a 400 status code and a JSON object with the error message
            message: error.message, //The error message
            user: user //The user
          }); //Return a 400 status code and a JSON object with the error message
        }
        req.login(user, { session: false }, (error) => { //If there is no error, log the user in
          if (error) { //If there is an error 
            res.send(error); //Send the error
          }
          let token = generateJWTToken(user.toJSON()); //Generate a JWT
          return res.json({ user, token }); //Return a JSON object with the user and the token
        });
      })(req, res); //Call the passport authentication function
    });
  }