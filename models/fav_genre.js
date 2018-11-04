const Sequelize = require('sequelize');
const sequelize = require('../db/getSequelize');
const bcrypt = require('bcrypt-nodejs');

const fav_genre = sequelize().define('fav_genre', {
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
    fav_genre: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
    }
};

module.exports = fav_genre;