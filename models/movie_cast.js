const Sequelize = require('sequelize');
const sequelize = require('../db/getSequelize');

const Movie = require('./movie');

const Movie_cast = sequelize().define('movie_cast', {
    movie_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
            model: Movie,
            key: 'movie_id',
            deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
        }
    },
    actor_name: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
    },
}, {
  timestamps: false,
  freezeTableName: true
});

module.exports = Movie_cast;