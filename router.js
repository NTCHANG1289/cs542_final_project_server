const dbConnection = require('./db/dbConnection');
const Authentication = require('./controllers/authentication');
const passportService = require('./services/passport');
const passport = require('passport');

const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('local', { session: false });

const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const User = require('./models/user');
const Movie = require('./models/movie');
const Movie_cast = require('./models/movie_cast');
const Movie_genre = require('./models/movie_genre');
const Recommend = require('./models/recommend');
const Review = require('./models/review');
const Fav_genre = require('./models/fav_genre');


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
    //console.log(movie_id);
    let recommendMovies = [];
    Recommend.findAll({ where: { movie_id1: movie_id }, raw: true }).each(result => {
      // console.log(movie_id);
      recommendMovies.push(result.movie_id2);
    }).then(() => {
      Movie.findAll({ where: { movie_id: recommendMovies } }).then((d) => res.send(d));
    });
  });

  // recommend by fav_genre
  app.get('/recommend/:user_id', (req, res) => {

    let all_genre = [];
    let all_movie = [];

    Fav_genre.findAll({
      where: { user_id: req.params.user_id }, raw: true
    })
      .each(d => all_genre.push(d.fav_genre))
      .then(() => Movie_genre.findAll({
        where: { genre: all_genre }
      })
        .each(d => all_movie.push(d.movie_id))
        .then(() => Movie.findAll({ where: { movie_id: all_movie } }).then(d => res.send(d))));

  });

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

  // get movie(s) by director
  app.get('/search/:director', (req, res) => {
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

  // get movies(s) by actor name. case-insensitive. partial match.
  app.get('/searchactor/:actor', (req, res) => {

    let param = "%" + req.params.actor + "%";
    let actorMovies = [];
    Movie_cast.findAll({
      where: {
        actor_name: { [Op.iLike]: param }
      }, raw: true
    }).each(result => {
      // console.log(movie_id);
      actorMovies.push(result.movie_id)
    }).then(() => {
      //console.log(actorMovies)
      Movie.findAll({ where: { movie_id: actorMovies } }).then((d) => res.send(d));
    });
  });

  // get movies(s) by genre. case-insensitive. partial match.
  app.get('/searchgenre/:genre', (req, res) => {

    let param = "%" + req.params.genre + "%";
    let genreMovies = [];
    Movie_genre.findAll({
      where: {
        genre: { [Op.iLike]: param }
      }, raw: true
    }).each(result => {

      genreMovies.push(result.movie_id)

    }).then(() => {
      //console.log(genreMovies)
      Movie.findAll({ where: { movie_id: genreMovies } }).then((d) => res.send(d));
    });
  });

  //  // get review by movie_id
  //  app.get('/reviewbymovie/:movie_id', (req, res) => {
  //
  //    Review.findAll({
  //      where: {
  //        movie_id: req.params.movie_id
  //      }
  //    }).then((d) => res.send(d));
  //  });
  //
  //  // get review by user_id
  //  app.get('/reviewbyuser/:user_id', (req, res) => {
  //
  //    Review.findAll({
  //      where: {
  //        user_id: req.params.user_id
  //      }
  //    }).then((d) => res.send(d));
  // });


  // create review
  app.post('/review', (req, res) => {
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
    }).then(d => res.send(d)).catch(err => {
      res.status(422).send({
        error: 'Fail to sign up'
      });
    });
  });

  //update review
  app.put('/review', (req, res) => {
    const {
      user_id,
      movie_id,
      rating,
      review,
      date
    } = req.body;

    Review.find({
      where: {
        user_id,
        movie_id
      }
    }).then(existReview => {
      if (existReview) {
        Review.update({
          review,
          rating
        },
          {
            where: {
              user_id,
              movie_id
            }
          }).then(review => {
            res.send(review);
          }).catch(err => res.status(422).send({
            error: 'Fail to update review'
          }));
      }
    }).catch(err => res.status(422).send({
      error: 'Fail to update review'
    }))
  });

  app.get('/reviewbymovie/:movie_id', (req, res) => {
    let getreview = [];
    Review.findAll({
      where: {
        movie_id: req.params.movie_id
      }
    }).each(async result => {
      const review = result.dataValues;
      await User.find({
        where: {
          user_id: review.user_id
        }
      }).then(user => {
        getreview.push(
          Object.assign({}, review, {
            username: user.dataValues.username
          })
        )
      })
    }).then(() => {
      res.send(getreview)
    });

  });

  app.get('/reviewbyuser/:user_id', (req, res) => {
    let getreview = [];
    Review.findAll({
      where: {
        user_id: req.params.user_id
      }
    }).each(async result => {
      const review = result.dataValues;
      await Movie.find({
        where: {
          movie_id: review.movie_id
        }
      }).then(movie => {
        getreview.push(Object.assign({}, review, {
          movie: movie.dataValues
        }))
      })
    }).then(() => {
      res.send(getreview)
    });
  });


};