const Sequelize = require('sequelize');
const sequelize = require('../db/getSequelize');
const User = require('./user');

const Fav_genres = sequelize().define('Fav_genress', {
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
    Fav_genres: {
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
    });

module.exports = Fav_genres;