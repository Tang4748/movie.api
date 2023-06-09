const { default: mongoose } = require('mongoose'); //Import mongoose
const bcrypt = require('bcrypt'); //Import bcrypt

let movieSchema = mongoose.Schema({ //Schema for movies
    Title: {type: String, required: true}, //Title of movie
    Description: {type: String, required: true}, //Description of movie
    Genre: { //Genre of movie
        Name: String, //Name of genre
        Description: String //Description of genre
    },
    Director: { //Director of movie
        Name: String, //Name of director
        Bio: String, //Bio of director
    },
    Actors: [String], //Actors in movie
    ImagePath: String, //Image of movie
    Featured: Boolean //Featured movie
});

let userSchema = mongoose.Schema({ //Schema for users 
    Username: {type: String, required: true}, //Username of user is required
    Password: {type: String, required: true}, //Password of user is required
    Birthday: Date, //Birthday of user
    FavoriteMovies: [{type: mongoose.Schema.Types.ObjectId, ref: 'Movie'}] // Favorite movies of user
});

//Hash password
userSchema.statics.hashPassword = (password) => { 
    return bcrypt.hashSync(password, 10);
};

//Validate password
userSchema.methods.validatePassword = function(password) { 
    console.log(password, this.Password);
    return bcrypt.compareSync(password, this.Password); 
}; 

// creation of models
let Movie = mongoose.model('Movie', movieSchema); //Movie model
let User = mongoose.model('User', userSchema); //User model


//export models
module.exports.Movie = Movie; //Export movie model
module.exports.User = User; //Export user model