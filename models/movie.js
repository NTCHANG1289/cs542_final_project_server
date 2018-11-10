const Sequelize = require('sequelize');
const sequelize = require('../db/getSequelize');

const Movie_cast = require('./movie_cast');
const Movie_genre = require('./movie_genre');
const Recommend = require('./recommend');
const Review = require('./review');

const Movie = sequelize().define('movie', {
  movie_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  title: {
    type: Sequelize.STRING
  },
  director: {
    type: Sequelize.STRING
  },
  duration: {
    type: Sequelize.INTEGER
  },
  rating: {
    type: Sequelize.INTEGER
  },
  year: {
    type: Sequelize.INTEGER
  },
  link: {
    type: Sequelize.STRING
  },
  image: {
    type: Sequelize.STRING
  },
  description: {
    type: Sequelize.STRING
  },
  gross: {
    type: Sequelize.INTEGER
  }
}, {
  timestamps: false,
  freezeTableName: true
});

// Movie + Movie_cast
Movie.hasMany(Movie_cast, { as: 'actor', foreignKey: 'movie_id' });
Movie_cast.belongsTo(Movie, { foreignKey: 'movie_id'});

// Movie + Movie_genre
Movie.hasMany(Movie_genre, { as: 'genre', foreignKey: 'movie_id' });
Movie_genre.belongsTo(Movie, { foreignKey: 'movie_id'});

// Movie + Recommend
Movie.hasMany(Recommend, { as: 'recommend', foreignKey: 'movie_id1' });
Recommend.belongsTo(Movie, { foreignKey: 'movie_id1'});


module.exports = Movie;