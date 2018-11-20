const Sequelize = require('sequelize');
module.exports = () => {
  return new Sequelize(process.env.DATABASE_URL || "postgresql://localhost/test", {
    dialectOptions: {
      useUTC: true, //for reading from database
    },
    timezone: '-05:00' //for writing to database
  });
  //return new Sequelize(process.env.DATABASE_URL || "postgresql://alex:610041@localhost/test");
}