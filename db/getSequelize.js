const Sequelize = require('sequelize');
module.exports = () => {
  //return new Sequelize(process.env.DATABASE_URL || "postgresql://localhost/test");
  return new Sequelize(process.env.DATABASE_URL || "postgresql://alex:610041@localhost/test");
}