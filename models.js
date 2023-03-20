const mongoose = require('mongoose');
let movieSchema = mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true}, 
    genre: {
        name: String,
        description: String
    },
    director: {
        name: String
    },
    actors: [String],
    image_path: String,
    featured: Boolean
});

let userSchema = mongoose.Schema({
    Username: {type: String, required: true},
    Password: {type: String, required: true},
    Email: {type: String, required: false},
    Birthday: Date,
    FavoriteMovies: [{type: mongoose.Schema.Types.ObjectId, ref: 'Movie'}]
});

let genreSchema = mongoose.Schema({
    Name: {type: String, required: true},
    Description: {type: String, required: true}
});

let directorSchema = mongoose.Schema({
    Name: {type: String, required: true}
});

let Director = mongoose.model('Director', directorSchema);
let Genre = mongoose.model('Genre', genreSchema);
let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchema);

module.exports.Director = Director;
module.exports.Genre = Genre;
module.exports.Movie = Movie;
module.exports.User = User;