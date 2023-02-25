const express = require("express"); // Importing express
const app = express(); // Creating an instance of express
morgan = require("morgan"); // Logging
const bodyParser = require("body-parser"); // Parsing JSON
methodOverride = require("method-override"); // PUT and DELETE requests

// Logging
app.use(morgan("common"));
// Parsing JSON
app.use(bodyParser.urlencoded(
    { extended: true }
)); 

app.use(bodyParser.json()); 
app.use(methodOverride()); 

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

 // Static files
app.use(express.static("public"));

let topMovies = [
    {
        title: 'The Godfather',
        director: 'Francis Ford Coppola',
        genre: 'Crime',
        year: '1972'
    },
    {
        title: 'The Shawshank Redemption',
        director: 'Frank Darabont',
        genre: 'Crime',
        year: '1994'
    },
    {
        title: 'Schindler\'s List',
        director: 'Steven Spielberg',
        genre: 'Biography',
        year: '1993'
    },
    {
        title: 'Raging Bull',
        director: 'Martin Scorsese',
        genre: 'Biography',
        year: '1980'
    },
    {
        title: 'Casablanca',
        director: 'Michael Curtiz',
        genre: 'Romance',
        year: '1942'
    },
    {
        title: 'Citizen Kane',
        director: 'Orson Welles',
        genre: 'Mystery', 
        year: '1941'
    },
    {
        title: 'Gone with the Wind',
        director: 'Victor Fleming',
        genre: 'Romance',
        year: '1939'
    },
    {
        title: 'The Wizard of Oz',
        director: 'Victor Fleming',
        genre: 'Family',
        year: '1939'
    },
    {
        title: 'Watchmen',
        director: 'Zack Snyder',
        genre: 'Action',
        year: '2009'
    },
    {
        title: 'The Dark Knight',
        director: 'Christopher Nolan',
        genre: 'Action',
        year: '2008'
    }]; 

// GET requests
  app.get('/', (req, res) => {
    res.send('Welcome to my movie database!');
  });
  
  app.get('/documentation', (req, res) => {                  
    res.sendFile('public/documentation.html', { root: __dirname });
  });
  
  app.get('/movies', (req, res) => {
    res.json(topMovies);
  });
  
  
  // listen for requests
  app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
  });
