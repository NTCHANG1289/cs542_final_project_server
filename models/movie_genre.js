const Sequelize = require('sequelize');
const sequelize = require('../db/getSequelize');

const Movie = require('./movie');

const Movie_genre = sequelize().define('movie_genre', {
    movie_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true
        // references: {
        //     model: Movie,
        //     key: 'movie_id',
        //     deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
        // }
    },
    genre: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
    },
}, {
  timestamps: false,
  freezeTableName: true
});

module.exports = Movie_genre;