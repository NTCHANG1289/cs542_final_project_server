const Sequelize = require('sequelize');
module.exports = () => {
  return new Sequelize(process.env.DATABASE_URL || "postgresql://localhost/test");
}