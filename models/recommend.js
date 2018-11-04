const Sequelize = require('sequelize');
const sequelize = require('../db/getSequelize');
const bcrypt = require('bcrypt-nodejs');

const recommend = sequelize().define('recommend', {
    movie_id1: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
            model: movie,
            key: 'movie_id',
            deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
        }
    },
    movie_id2: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
            model: movie,
            key: 'movie_id',
            deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
        }
    }
};

module.exports = recommend;