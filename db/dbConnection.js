const { Client } = require('pg');

module.exports = () => {
  return new Client({
    //connectionString: process.env.DATABASE_URL || "postgresql://localhost/test"
    connectionString: process.env.DATABASE_URL || "postgresql://alex:610041@localhost/test"
  });
}