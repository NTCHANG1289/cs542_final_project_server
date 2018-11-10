const Sequelize = require('sequelize');
const sequelize = require('../db/getSequelize');

const User = require('./user');
const Movie = require('./movie');

const Review = sequelize().define('review', {
    user_id: {
        type: Sequelize.TEXT,
        allowNull: false,
        primaryKey: true,
        references: {
            model: User,
            key: 'user_id',
            deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
        }
    },
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
    rating: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    review: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    date: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
    }
}, {
  timestamps: false,
  freezeTableName: true
});

//Review.belongsTo(Movie, { foreignKey: 'movie_id'});
//Review.belongsTo(User, { foreignKey: 'user_id'});

module.exports = Review;