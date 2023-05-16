//this file is known as a controller

const express = require('express'), //Import express
    morgan = require('morgan'), //Import morgan
    app = express(), //Create an instance of express
    bodyParser = require('body-parser'), //Import body-parser
    methodOverride = require('method-override'), //Import method-override
    uuid = require('uuid'), //Import uuid
    mongoose = require('mongoose'), //Import mongoose
    Models = require('./models.js'), //Import the models.js file
    Movies = Models.Movie, //Movies is a variable that represents the Movie model
    Users = Models.User; //Users is a variable that represents the User model

/* mongoose.connect('mongodb://localhost:27017/themovieapi', { useNewUrlParser: true, useUnifiedTopology: true}); */ // Connect to the app database 

mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true }); // Connect to the database 

app.use(express.static('public')); //Serve static files from the public folder
app.use(morgan('common')); //Log all requests to the console
app.use(bodyParser.urlencoded({ //Use body-parser to parse the request body
  extended: true
}));
app.use(bodyParser.json()); //Use body-parser to parse the request body
app.use(methodOverride()); //Use method-override to allow for the use of HTTP verbs such as PUT and DELETE in places where the client doesn't support it

const { check, validationResult } = require('express-validator'); //Import express-validator

const cors = require('cors'); //Import cors

let allowedOrigins = ['http://localhost:8080', 'http://testsite.com']; //Create an array of allowed origins

app.use(cors({ //Use cors to allow cross-origin resource sharing
  origin: (origin, callback) => { //Check the origin of the request
    if(!origin) return callback(null, true); //If there is no origin, allow the request
    if(allowedOrigins.indexOf(origin) === -1){ //If the origin is not in the allowed origins array, return an error message
      let message = 'The CORS policy for this appilcation doesn\'t allow access from origin ' + origin; //Create an error message
      return callback(new Error(message), false); //Return the error message
    }
    return callback(null, true); //If the origin is in the allowed origins array, allow the request
  }
}));

let auth = require('./auth')(app); //Import the auth.js file and pass it the app variable
const passport = require('passport'); //Import passport
require('./passport'); //Import the passport.js file

//Read (GET) Request
app.get('/', (req, res) => {                  
res.sendFile('public/documentation.html', { root: __dirname }); //sends the documentation.html file to the client
});

// Get (READ) all users
app.get('/users', passport.authenticate('jwt', { session: false }), (req, res) => { //requests data for all users
  Users.find() //finds all users
  .then((users) => { //if the users are found 
    res.status(201).json(users); //return the users as JSON
  })
  .catch((err) => { //if there's an error
    console.error(err); //log the error
    res.status(500).send('Error: ' + err); //return an error
  });
});

//Get (READ) a user by username
app.get('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => { //requests data for a specific user
  Users.findOne({ Username: req.params.Username }) //finds the user with the username that matches the request
  .then((user) => { //if the user is found
    res.json(user) //return the user as JSON
  })
  .catch((error) => { //if there's an error
    console.error(err); //log the error
    res.status(500).send('Error: ' + error); //return an error
  });
});

//Get (READ) all movies 
app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => { //requests data for all movies and au
  Movies.find() //finds all movies
  .then((movies) => { //if the movies are found
    res.status(201).json(movies); //return the movies as JSON
  })
  .catch((err) => { //if there's an error
    console.error(err); //log the error
    res.status(500).send('Error: ' + err); //return an error
  });
});

//Get (READ) a movie by title
app.get('/movies/:Title', passport.authenticate('jwt', { session: false }), (req, res) => { //requests data for a specific movie
  Movies.findOne({ Title: req.params.Title }) //finds the movie with the title that matches the request
  .then((movie) => { //if the movie is found
    res.json(movie) //return the movie as JSON
  })
  .catch((error) => { //if there's an error
    console.error(err); //log the error
    res.status(500).send('Error: ' + error); //return an error
  });
});

//Get (READ) movie genre by name
app.get('/movies/genres/:Name', passport.authenticate('jwt', { session: false }), (req, res) => { //requests data for a specific movie genre
  Movies.findOne({ 'Genre.Name': req.params.Name }) //finds the movie genre with the name that matches the request
  .then((movie) => { //if the movie genre is found
    res.json(movie.Genre) //return the movie genre as JSON
  })
  .catch((error) => { //if there's an error
    console.error(err); //log the error
    res.status(500).send('Error: ' + error); //return an error
  });
});

//Get (READ) movie director by name
app.get('/movies/directors/:Name', passport.authenticate('jwt', { session: false }), (req, res) => { //requests data for a specific movie director
  Movies.findOne({ 'Director.Name': req.params.Name }) //finds the movie director with the name that matches the request
  .then((movie) => { //if the movie director is found
    res.json(movie.Director) //return the movie director as JSON
  })
  .catch((error) => { //if there's an error
    console.error(err); //log the error
    res.status(500).send('Error: ' + error); //return an error
  });
});

//Update (PUT) User Data
app.put("/users/:Username", [
  check('Username', 'Username is required').isLength({ min: 5 }), //checks if the username is at least 5 characters long
  check('Username', 'Username is contains non alphanumeric characters - not allowed.').isAlphanumeric(),
  check('Password', 'Password is required').notEmpty(), //checks if the password is not empty
  ],
  passport.authenticate('jwt', { session: false }), 
  (req, res) => { //updates a user's data
    let errors = validationResult(req); //checks for validation errors
    if (!errors.isEmpty()) { //if there are validation errors 
      return res.status(422).json({ errors: errors.array() //return the errors as JSON
  }); 
    }
    let hashedPassword = Users.hashPassword(req.body.Password); //hashes the password
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      { $set: { //finds the user with the username that matches the request and updates the user's data
          Username: req.body.Username, //get the username data from the request body
          Password: req.body.Password, //get the password data from the request body
          Birthday: req.body.Birthday, }, //get the birthday data from the request body
      },
      { new: true }
    )
      .then((updatedUser) => {
        if (!updatedUser) {
          return res.status(400).send(req.body.Username + " doesn't exist");
        } else {
          res.json(updatedUser);
        }
      }) 
      .catch((error) => {
        console.error(error);
        res.status(500).send("Error: " + error);
      });
  });

//Create (POST) Data
app.post('/users', [
  check('Username', 'Username is required').isLength({ min: 5 }), //checks if the username is at least 5 characters long
  check('Username', 'Username is contains non alphanumeric characters - not allowed.').isAlphanumeric(),
  check('Password', 'Password is required').notEmpty(), //checks if the password is not empty
  ],
(req, res) => { //creates a new user
  let errors = validationResult(req); //checks for validation errors
  if (!errors.isEmpty()) { //if there are validation errors 
    return res.status(422).json({ errors: errors.array() //return the errors as JSON
}); 
  }
  let hashedPassword = Users.hashPassword(req.body.Password); //hashes the password
  Users.findOne({ Username: req.body.Username }) //finds a user with the username from the request body
  .then((user) => { 
    if (user) { // if the user exists
      return res.status(400).send(req.body.Username + ' already exists');  //return an error stating the user already exists
    } else { //if the user doesn't exist
      Users
        .create({ //create the user
          Username: req.body.Username, //get the username data from the request body
          Password: hashedPassword, //get the password data from the request body
          Birthday: req.body.Birthday //get the birthday data from the request body
        })
        .then((user) => { res.status(201).json(user) }) //return the user as JSON
        .catch((error) => {  //if there's an error
          console.error(error); //log the error
          res.status(500).send('Error: ' + error); //return an error
        });
    }
  })
  .catch((error) => { //if there's an error 
    console.error(error); //log the error
    res.status(500).send('Error: ' + error); //return an error
});
});

//Add a movie to a user's favorites
app.post('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => { //adds a movie to a user's list of favorites
  
  Users.findOneAndUpdate({ Username: req.params.Username }, { //finds the user with the username that matches the request
    $push: { FavoriteMovies: req.params.MovieID } //adds the movie to the user's list of favorites
  },
  { new: true }) //returns the updated document
  .then((updatedUser) => { //if the user is found
    res.json(updatedUser); //return the user as JSON
  })
  .catch((error) => { //if there's an error
    console.error(error); //log the error
    res.status(500).send('Error: ' + error); //return an error
  });
});

//Delete a movie from a user's favorites
app.delete('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => { //adds a movie to a user's list of favorites
  Users.findOneAndUpdate({ Username: req.params.Username }, { //finds the user with the username that matches the request
    $pull: { FavoriteMovies: req.params.MovieID } //adds the movie to the user's list of favorites
  },
  { new: true }) //returns the updated document
  .then((updatedUser) => { //if the user is found
    res.json(updatedUser); //return the user as JSON
  })
  .catch((error) => { //if there's an error
    console.error(error); //log the error
    res.status(500).send('Error: ' + error); //return an error
  });
});

//Delete (DELETE) User by username
app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => { //deletes a user
  Users.findOneAndRemove({ Username: req.params.Username }) //finds the user with the username that matches the request
    .then((user) => { //if the user is found
      if (!user) { //if the user doesn't exist
        res.status(400).send(req.params.Username + ' was not found'); //return an error stating the user doesn't exist
      } else { //if the user exists
        res.status(200).send(req.params.Username + ' was deleted.'); //return a message stating the user was deleted
      }
    })
    .catch((err) => { //if there's an error
      console.error(err); //log the error
      res.status(500).send('Error: ' + err); //return an error
    });
});

//error handling
app.use((err, req, res, next) => { 
  console.error(err.stack);
  res.status(500).send('Something\'s not quite right!');
});

// listen for requests
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
 console.log('Listening on Port ' + port);
})
  

