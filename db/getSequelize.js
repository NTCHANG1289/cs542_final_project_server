const Sequelize = require('sequelize');
module.exports = () => {
  return new Sequelize(process.env.DATABASE_URL || "postgresql://localhost/test", {
    dialectOptions: {
      useUTC: false, //for reading from database
      dateStrings: true,
      typeCast: true
    },
    timezone: '-05:00' //for writing to database
  });
  //return new Sequelize(process.env.DATABASE_URL || "postgresql://alex:610041@localhost/test");
}