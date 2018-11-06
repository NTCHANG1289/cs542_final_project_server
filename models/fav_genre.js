const Sequelize = require('sequelize');
const sequelize = require('../db/getSequelize');
const User = require('./user');

const Fav_genre = sequelize().define('fav_genre', {
    user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        // references: {
        //     model: 'users',
        //     key: 'user_id',
        //     deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
        // }
    },
    fav_genre: {
        type: Sequelize.STRING,
        allowNull: false,
        // get: function () {
        //     return JSON.parse(this.getDataValue('Fav_genres'));
        // },
        // set: function (val) {
        //     return this.setDataValue('Fav_genres', JSON.stringify(val));
        // }
    }
}, {
        timestamps: false,
        freezeTableName: true,
    });

module.exports = Fav_genre;