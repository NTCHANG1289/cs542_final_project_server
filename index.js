const express = require('express');
const { Client } = require('pg');
// var dbConfig = require('./dbconfig.js');

const app = express();

app.get('/', (req, res) => {
  const client = new Client({
    connectionString: process.env.DATABASE_URL || "postgresql://localhost:5432",
    // ssl: true,
  });
  client.connect();
  var rows;
  client.query('SELECT * from movie;', (err, response) => {
    if (err) {
      console.log(err.message);
      throw err;
    }
    rows = response.rows;
    for (let row of response.rows) {
      console.log(JSON.stringify(row));
    }
    client.end();
    res.send(rows.map(row => JSON.stringify(row)));
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT);