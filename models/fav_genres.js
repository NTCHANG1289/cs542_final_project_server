const Sequelize = require('sequelize');
const sequelize = require('../db/getSequelize');
const User = require('./user');

const Fav_genre = sequelize().define('fav_genres', {
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
        //     return JSON.parse(this.getDataValue('fav_genre'));
        // },
        // set: function (val) {
        //     return this.setDataValue('fav_genre', JSON.stringify(val));
        // }
    }
}, {
        timestamps: false,
    });

module.exports = Fav_genre;