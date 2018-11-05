const Sequelize = require('sequelize');
const sequelize = require('../db/getSequelize');
const bcrypt = require('bcrypt-nodejs');
const uuid = require('uuid');
const Fav_genres = require('./Fav_genres');

const User = sequelize().define('user', {
  user_id: {
    type: Sequelize.UUID,
    autoIncrement: true,
    primaryKey: true,
    defaultValue: uuid()
  },
  username: {
    type: Sequelize.STRING
  },
  email: {
    type: Sequelize.STRING
  },
  password: {
    type: Sequelize.TEXT
  },
  gender: {
    type: Sequelize.STRING
  },
  dob: {
    type: Sequelize.DATE
  }
}, {
    timestamps: false,
    hooks: {
      beforeCreate(user) {
        return new Promise((resolve, reject) => {
          bcrypt.hash(user.password, bcrypt.genSaltSync(10), null, function (err, hash) {
            if (err) {
              console.log(err);
            }
            user.password = hash;
            return resolve(user);
          });
        });
      }
    }
  });

User.prototype.validPassword = function (password, callback) {
  return bcrypt.compare(password, this.password, (err, isMatch) => {
    if (err) {
      return callback(err);
    }
    callback(null, isMatch);
  });
}

User.hasMany(Fav_genres, { as: 'Fav_genress', foreignKey: 'user_id' });
Fav_genres.belongsTo(User, { foreignKey: 'user_id'});

module.exports = User;