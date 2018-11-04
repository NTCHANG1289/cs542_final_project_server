const Sequelize = require('sequelize');
const sequelize = require('../db/getSequelize');
const bcrypt = require('bcrypt-nodejs');

const movie_genre = sequelize().define('movie_genre', {
    movie_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true
        references: {
            model: movie,
            key: 'movie_id',
            deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
        }
    },
    genre: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
    },
};

module.exports = movie_genre;