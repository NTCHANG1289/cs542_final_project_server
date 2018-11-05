const Sequelize = require('sequelize');
const sequelize = require('../db/getSequelize');

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
    }
});


module.exports =  Movie;