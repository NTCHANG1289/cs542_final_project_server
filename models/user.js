const Sequelize = require('sequelize');
const sequelize = require('../db/getSequelize');
const bcrypt = require('bcrypt-nodejs');

const User = sequelize().define('user', {
  username: {
    type: Sequelize.STRING
  },
  email: {
    type: Sequelize.STRING
  },
  password: {
    type: Sequelize.STRING
  },
  gender: {
    type: Sequelize.STRING
  }
}, {
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

User.prototype.validPassword = function(password, callback) {
  return bcrypt.compare(password, this.password, (err, isMatch) => {
    if (err) {
      return callback(err);
    }
    callback(null, isMatch);
  });
}

module.exports = User;