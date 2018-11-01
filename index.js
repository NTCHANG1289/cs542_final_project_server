const express = require('express');
const { Client } = require('pg');
const cors = require('cors');
// var dbConfig = require('./dbconfig.js');

const app = express();
app.use(cors());

app.get('/movies', (req, res) => {
  const client = new Client({
    connectionString: process.env.DATABASE_URL || "postgresql://localhost/test",
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
    // res.header("Access-Control-Allow-Origin", '*');
    // res.header("Access-Control-Allow-Credentials", true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.send(rows.map(row => JSON.stringify(row)));
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT);