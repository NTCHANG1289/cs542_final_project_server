const Sequelize = require('sequelize');
const sequelize = require('../db/getSequelize');
const bcrypt = require('bcrypt-nodejs');

const review = sequelize().define('review', {
    user_id: {
        type: Sequelize.TEXT,
        allowNull: false,
        primaryKey: true,
        references: {
            model: user,
            key: 'user_id',
            deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
        }
    },
    movie_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    rating: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    review: {
        type: Sequelize.TEXT,
        allowNull: false,
        primaryKey: true
    }
});

module.exports = review;