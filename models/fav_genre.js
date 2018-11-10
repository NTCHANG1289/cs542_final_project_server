const Sequelize = require('sequelize');
const sequelize = require('../db/getSequelize');
const User = require('./user');

const Fav_genre = sequelize().define('fav_genre', {
    user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true
        // references: {
        //     model: User,
        //     key: 'user_id',
        //     deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
        // }
    },
    fav_genre: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
    }
}, {
        timestamps: false,
        freezeTableName: true,
    });

module.exports = Fav_genre;