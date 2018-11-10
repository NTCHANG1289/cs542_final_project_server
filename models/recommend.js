const Sequelize = require('sequelize');
const sequelize = require('../db/getSequelize');

const Movie = require('./movie');

const Recommend = sequelize().define('recommend', {
    movie_id1: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true
        // references: {
        //     model: Movie,
        //     key: 'movie_id',
        //     deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
        // }
    },
    movie_id2: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true
        // references: {
        //     model: Movie,
        //     key: 'movie_id',
        //     deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
        // }
    }
}, {
        timestamps: false,
        freezeTableName: true
    });

module.exports = Recommend;