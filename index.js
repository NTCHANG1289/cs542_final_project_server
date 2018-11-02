const express = require('express');
const { Client } = require('pg');
const cors = require('cors');
// var dbConfig = require('./dbconfig.js');

const app = express();
app.use(cors());

function getDBConnection() {
  return new Client({
    // connectionString: process.env.DATABASE_URL || "postgresql://localhost/test"
    connectionString: process.env.DATABASE_URL || "postgresql://localhost/test" || "postgresql://alex:610041@localhost/test"
  });
}

// Jonathan's example: get all movies
app.get('/movies', (req, res) => {
  const client = getDBConnection();
  client.connect();
  var rows;
  client.query('SELECT * from movie_view;', (err, response) => {
    if (err) {
      console.log(err.message);
      throw err;
    }
    rows = response.rows;

    client.end();
    res.send(rows);
  });
});

// get movie(s) by title. case-insensitive. partial match.
app.get('/searchtitle/:title', (req, res) => {
  const client = getDBConnection();
  client.connect();
  var rows;
  let param = "'%" + req.params.title + "%'";
  let queryString = 'SELECT * FROM movie WHERE title ILIKE ' + param + 'ORDER BY year DESC';
  client.query(queryString, (err, response) => {
    if (err) {
      console.log(err.message);
      throw err;
    }
    rows = response.rows;
    // for (let row of response.rows) {
    //   console.log(JSON.stringify(row));
    // }
    client.end();
    res.send(rows);
  });
});

// get movies(s) by director name. case-insensitive. partial match.
app.get('/searchdirector/:director', (req, res) => {
  const client = getDBConnection();
  client.connect();
  var rows;
  let param = "'%" + req.params.director + "%'";
  let queryString = 'SELECT * FROM movie WHERE director ILIKE ' + param + 'ORDER BY year DESC';
  client.query(queryString, (err, response) => {
    if (err) {
      console.log(err.message);
      throw err;
    }
    rows = response.rows;
    // for (let row of response.rows) {
    //   console.log(JSON.stringify(row));
    // }
    client.end();
    res.send(rows);
  });
});

// get movies(s) by actor name. case-insensitive. partial match.
app.get('/searchactor/:actor', (req, res) => {
  const client = getDBConnection();
  client.connect();
  var rows;
  let param = "'%" + req.params.actor + "%'";
  let queryString = "SELECT * FROM movie WHERE movie_id IN (SELECT movie_id FROM movie_cast WHERE actor_name ILIKE" + param + ")" + 'ORDER BY year DESC';
  client.query(queryString, (err, response) => {
    if (err) {
      console.log(err.message);
      throw err;
    }
    rows = response.rows;
    // for (let row of response.rows) {
    //   console.log(JSON.stringify(row));
    // }
    client.end();
    res.send(rows);
  });
});

// get movies(s) by genre. case-insensitive. partial match.
app.get('/searchgenre/:genre', (req, res) => {
  const client = getDBConnection();
  client.connect();
  var rows;
  let param = "'%" + req.params.genre + "%'";
  let queryString = "SELECT * FROM movie WHERE movie_id IN (SELECT movie_id FROM movie_genre WHERE genre ILIKE" + param + ")";
  client.query(queryString, (err, response) => {
    if (err) {
      console.log(err.message);
      throw err;
    }
    rows = response.rows;
    // for (let row of response.rows) {
    //   console.log(JSON.stringify(row));
    // }
    client.end();
    res.send(rows);
  });
});

// user register?
// review insert
// review update

const PORT = process.env.PORT || 5000;
app.listen(PORT);