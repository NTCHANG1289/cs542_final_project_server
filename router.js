const dbConnection = require('./db/dbConnection');
const Authentication = require('./controllers/authentication');
const passportService = require('./services/passport');
const passport = require('passport');

const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('local', { session: false });

const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const Movie = require('./models/movie');
const Movie_cast = require('./models/movie_cast');
const Movie_genre = require('./models/movie_genre');
const Recommend = require('./models/recommend');
const Review = require('./models/review');


module.exports = app => {
  // app.get('/', requireAuth, (req, res) => {
  //   res.send({ 'hi': 'there' });
  // })

  app.post('/signin', requireSignin, Authentication.signin)

  app.post('/signup', Authentication.signup);

  app.get('/movies/recommend', (req, res) => {
    const {
      movie_id
    } = req.query;
    console.log(movie_id);
    let recommendMovies = [];
    Recommend.findAll({ where: { movie_id1: movie_id }, raw: true }).each(result => {
      // console.log(movie_id);
      recommendMovies.push(result.movie_id2);
    }).then(() => {
    Movie.findAll({ where: {movie_id: recommendMovies}}).then((d) => res.send(d));
    });
  });

  // // get all movies
  // app.get('/movies', (req, res) => {
  //   const client = dbConnection();
  //   client.connect();
  //   var rows;
  //   client.query('SELECT * from movie_view;', (err, response) => {
  //     if (err) {
  //       console.log(err.message);
  //       throw err;
  //     }
  //     rows = response.rows;
  //     client.end();
  //     res.send(rows);
  //   });
  // });

  // get all movies
  app.get('/movies', (req, res) => {
    Movie.findAll({
      include: [
        { model: Movie_cast, as: 'actor', attributes: ['actor_name'] },
        { model: Movie_genre, as: 'genre', attributes: ['genre'] },
        { model: Recommend, as: 'recommend', attributes: ['movie_id2'] }
        ]
    }).then(d => res.send(d));
  });

  // // get movie(s) by title. case-insensitive. partial match.
  // app.get('/searchtitle/:title', (req, res) => {
  //   const client = dbConnection();
  //   client.connect();
  //   var rows;
  //   let param = "'%" + req.params.title + "%'";
  //   let queryString = 'SELECT * FROM movie_view WHERE title ILIKE ' + param;
  //   client.query(queryString, (err, response) => {
  //     if (err) {
  //       console.log(err.message);
  //       throw err;
  //     }
  //     rows = response.rows;
  //     client.end();
  //     res.send(rows);
  //   });
  // });

  // get all genres
  app.get('/genres', (req, res) => {
    movie_list = [];
    Movie_genre.aggregate('genre', 'DISTINCT', { plain: false })
      .each(result => (
        movie_list.push(result.DISTINCT)))
      .then(() => res.send(movie_list));
  });

  // get all actors
  app.get('/actors', (req, res) => {
    actor_list = [];
      Movie_cast.aggregate('actor_name', 'DISTINCT', { plain: false })
        .each(result => (
          actor_list.push(result.DISTINCT)))
        .then(() => res.send(actor_list));
  });

  // get all directors
  app.get('/directors', (req, res) => {
    director_list = [];
    Movie.aggregate('director', 'DISTINCT', { plain: false })
      .each(result => (
        director_list.push(result.DISTINCT)))
      .then(() => res.send(director_list));
  });

  // get movie(s) by title.
  app.get('/searchtitle/:title', (req, res) => {
    let query = {};
    query.include = [
      { model: Movie_cast, as: 'actor', attributes: ['actor_name'] },
      { model: Movie_genre, as: 'genre', attributes: ['genre'] },
      { model: Recommend, as: 'recommend', attributes: ['movie_id2'] }
    ];
    query.where = {
      title: {
        [Op.iLike]: "%" + req.params.title + "%"
      }
    };
    Movie.findAll(query).then(d => res.send(d));
  });

  // // get movies(s) by director name. case-insensitive. partial match.
  // app.get('/searchdirector/:director', (req, res) => {
  //   const client = dbConnection();
  //   client.connect();
  //   var rows;
  //   let param = "'%" + req.params.director + "%'";
  //   let queryString = 'SELECT * FROM movie_view WHERE director ILIKE ' + param + 'ORDER BY year DESC';
  //   client.query(queryString, (err, response) => {
  //     if (err) {
  //       console.log(err.message);
  //       throw err;
  //     }
  //     rows = response.rows;
  //     client.end();
  //     res.send(rows);
  //   });
  // });

  app.get('/searchdirector', (req, res) => {
    let query = {};
    query.include = [
      { model: Movie_cast, as: 'actor', attributes: ['actor_name'] },
      { model: Movie_genre, as: 'genre', attributes: ['genre'] },
      { model: Recommend, as: 'recommend', attributes: ['movie_id2'] }
    ];
    query.where = {
      director: {
        [Op.iLike]: "%" + req.query.director + "%"
      }
    };
    Movie.findAll(query).then(d => res.send(d));
  });


  // // get movies(s) by actor name. case-insensitive. partial match.
  // app.get('/searchactor/:actor', (req, res) => {
  //   const client = dbConnection();
  //   client.connect();
  //   var rows;
  //   let param = "'%" + req.params.actor + "%'";
  //   let queryString = 'SELECT * FROM movie_view WHERE movie_view.movie_id IN (SELECT movie_id FROM movie_cast WHERE actor_name ILIKE ' + param + ')';
  //   client.query(queryString, (err, response) => {
  //     if (err) {
  //       console.log(err.message);
  //       throw err;
  //     }
  //     rows = response.rows;
  //     client.end();
  //     res.send(rows);
  //   });
  // });

  // get movies(s) by actor name. case-insensitive. partial match.
  app.get('/searchactor/:actor', (req, res) => {

    let param = "%" + req.params.actor + "%";
    let actorMovies = [];
    Movie_cast.findAll({
      where: { actor_name: { [Op.iLike]: param}
      }, raw: true }).each(result => {
      // console.log(movie_id);
      actorMovies.push(result.movie_id)
      }).then(() => {
      //console.log(actorMovies)
        Movie.findAll({ where: {movie_id: actorMovies}}).then((d) => res.send(d));
    });
  });

  // get movies(s) by genre. case-insensitive. partial match.
  // app.get('/searchgenre/:genre', (req, res) => {
  //   const client = dbConnection();
  //   client.connect();
  //   var rows;
  //   let param = "'%" + req.params.genre + "%'";
  //   let queryString = 'SELECT * FROM movie_view WHERE movie_view.movie_id IN (SELECT movie_id FROM movie_genre WHERE genre ILIKE ' + param + ')';
  //   client.query(queryString, (err, response) => {
  //     if (err) {
  //       console.log(err.message);
  //       throw err;
  //     }
  //     rows = response.rows;
  //     client.end();
  //     res.send(rows);
  //   });
  // });

  // get movies(s) by genre. case-insensitive. partial match.
  app.get('/searchgenre/:genre', (req, res) => {

    let param = "%" + req.params.genre + "%";
    let genreMovies = [];
    Movie_genre.findAll({
      where: { genre: { [Op.iLike]: param}
      }, raw: true }).each(result => {

        genreMovies.push(result.movie_id)

      }).then(() => {
        //console.log(genreMovies)
        Movie.findAll({ where: {movie_id: genreMovies}}).then((d) => res.send(d));
      });
  });

  // get review for the detail page

  // create review
  //app.get('/reviews', (req, res) => {
  app.post('/reviews', (req, res) => {

    const {
      user_id,
      movie_id,
      rating,
      review,
      date
    } = req.body;

    Review.create({
      user_id,
      movie_id,
      rating,
      review,
      date
    }).then(d => res.send(d));

  });

  // get reviews by movie title.
  // app.get('/searchtitle/:title/review', (req, res) => {
  //   const client = dbConnection();
  //   client.connect();
  //   var rows;
  //   let param = "'%" + req.params.title + "%'";
  //   let queryString = 'SELECT * FROM review WHERE review.movie_id IN (SELECT movie_id FROM movie_view WHERE title ILIKE ' + param + ')';
  //   client.query(queryString, (err, response) => {
  //     if (err) {
  //       console.log(err.message);
  //       throw err;
  //     }
  //     rows = response.rows;
  //     client.end();
  //     res.send(rows);
  //   });
  // });

  //recommend
  // app.get('/searchtitle/:title/recommend', (req, res) => {
  //   const client = dbConnection();
  //   client.connect();
  //   var rows;
  //   let param = "'%" + req.params.title + "%'";
  //   //select movie_id1, movie_view.title
  //   //from recommend, movie_view
  //   //where movie_id2 = 9
  //   //'SELECT movie_id1, movie_view.title FROM recommend, movie_view WHERE recommend.movie_id1 IN (SELECT movie_id FROM movie_view WHERE title ILIKE ' + param + ')';
  //   let queryString = 'SELECT distinct (movie_view.title) FROM recommend, movie_view WHERE recommend.movie_id2 IN (SELECT movie_id FROM movie_view WHERE title ILIKE ' + param + ') and movie_view.movie_id IN (SELECT movie_id FROM movie_view WHERE title ILIKE ' + param + ')';
  //   client.query(queryString, (err, response) => {
  //     if (err) {
  //       console.log(err.message);
  //       throw err;
  //     }
  //     rows = response.rows;
  //     client.end();
  //     res.send(rows);
  //   });
  // });
};