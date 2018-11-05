const dbConnection = require('./db/dbConnection');
const Authentication = require('./controllers/authentication');
const passportService = require('./services/passport');
const passport = require('passport');

const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('local', { session: false });

module.exports = app => {
  // app.get('/', requireAuth, (req, res) => {
  //   res.send({ 'hi': 'there' });
  // })

  app.post('/signin', requireSignin, Authentication.signin)

  app.post('/signup', Authentication.signup);
  // Jonathan's example: get all movies
  app.get('/movies', (req, res) => {
    const client = dbConnection();
    client.connect();
    var rows;
    client.query('SELECT * from movie_view;', (err, response) => {
      if (err) {
        console.log(err.message);
        throw err;
      }
      rows = response.rows;
      client.end();
      res.
      res.send(rows);
    });
  });

  // get movie(s) by title. case-insensitive. partial match.
  app.get('/searchtitle/:title', (req, res) => {
    const client = dbConnection();
    client.connect();
    var rows;
    let param = "'%" + req.params.title + "%'";
    let queryString = 'SELECT * FROM movie_view WHERE title ILIKE ' + param;
    client.query(queryString, (err, response) => {
      if (err) {
        console.log(err.message);
        throw err;
      }
      rows = response.rows;
      client.end();
      res.send(rows);
    });
  });

  // get movies(s) by director name. case-insensitive. partial match.
  app.get('/searchdirector/:director', (req, res) => {
    const client = dbConnection();
    client.connect();
    var rows;
    let param = "'%" + req.params.director + "%'";
    let queryString = 'SELECT * FROM movie_view WHERE director ILIKE ' + param + 'ORDER BY year DESC';
    client.query(queryString, (err, response) => {
      if (err) {
        console.log(err.message);
        throw err;
      }
      rows = response.rows;
      client.end();
      res.send(rows);
    });
  });

  // get movies(s) by actor name. case-insensitive. partial match.
  app.get('/searchactor/:actor', (req, res) => {
    const client = dbConnection();
    client.connect();
    var rows;
    let param = "'%" + req.params.actor + "%'";
    let queryString = 'SELECT * FROM movie_view WHERE movie_view.movie_id IN (SELECT movie_id FROM movie_cast WHERE actor_name ILIKE ' + param + ')';
    client.query(queryString, (err, response) => {
      if (err) {
        console.log(err.message);
        throw err;
      }
      rows = response.rows;
      client.end();
      res.send(rows);
    });
  });

  // get movies(s) by genre. case-insensitive. partial match.
  app.get('/searchgenre/:genre', (req, res) => {
    const client = dbConnection();
    client.connect();
    var rows;
    let param = "'%" + req.params.genre + "%'";
    let queryString = 'SELECT * FROM movie_view WHERE movie_view.movie_id IN (SELECT movie_id FROM movie_genre WHERE genre ILIKE ' + param + ')';
    client.query(queryString, (err, response) => {
      if (err) {
        console.log(err.message);
        throw err;
      }
      rows = response.rows;
      client.end();
      res.send(rows);
    });
  });

  // get reviews by movie title.
  app.get('/searchtitle/:title/review', (req, res) => {
    const client = dbConnection();
    client.connect();
    var rows;
    let param = "'%" + req.params.title + "%'";
    let queryString = 'SELECT * FROM review WHERE review.movie_id IN (SELECT movie_id FROM movie_view WHERE title ILIKE ' + param + ')';
    client.query(queryString, (err, response) => {
      if (err) {
        console.log(err.message);
        throw err;
      }
      rows = response.rows;
      client.end();
      res.send(rows);
    });
  });

  //recommend
  app.get('/searchtitle/:title/recommend', (req, res) => {
    const client = dbConnection();
    client.connect();
    var rows;
    let param = "'%" + req.params.title + "%'";
    //select movie_id1, movie_view.title
    //from recommend, movie_view
    //where movie_id2 = 9
    //'SELECT movie_id1, movie_view.title FROM recommend, movie_view WHERE recommend.movie_id1 IN (SELECT movie_id FROM movie_view WHERE title ILIKE ' + param + ')';
    let queryString = 'SELECT distinct (movie_view.title) FROM recommend, movie_view WHERE recommend.movie_id2 IN (SELECT movie_id FROM movie_view WHERE title ILIKE ' + param + ') and movie_view.movie_id IN (SELECT movie_id FROM movie_view WHERE title ILIKE ' + param + ')';
    client.query(queryString, (err, response) => {
      if (err) {
        console.log(err.message);
        throw err;
      }
      rows = response.rows;
      client.end();
      res.send(rows);
    });
  });
};