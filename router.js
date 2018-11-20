const dbConnection = require('./db/dbConnection');
const Authentication = require('./controllers/authentication');
const passportService = require('./services/passport');
const passport = require('passport');

const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('local', { session: false });

const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const moment = require('moment');

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
    let recommendMovies = [];
    Recommend.findAll({ where: { movie_id1: movie_id }, raw: true }).each(result => {
      recommendMovies.push(result.movie_id2);
    }).then(() => {
      Movie.findAll({ where: { movie_id: recommendMovies } }).then((d) => res.send(d));
    });
  });

  // recommend by fav_genre
  app.get('/user/recommend', (req, res) => {
    let all_genre = [];
    let all_movie = [];

    Fav_genre.findAll({
      where: { user_id: req.query.user_id }, raw: true
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


  app.get('/searchdirector', (req, res) => {
    console.log('director', req.query.director);
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
          rating,
          date
        },
          {
            where: {
              user_id,
              movie_id
            }
          }).then(review => {
            res.send(review);
          }).catch(err => {
            res.status(422).send({
              error: err.message
            })
          });
      }
    }).catch(err => {
      res.status(422).send({
        error: err.message
      })
    })
  });

  app.get('/reviewbymovie/:movie_id', (req, res) => {
    let getreview = [];
    Review.findAll({
      where: {
        movie_id: req.params.movie_id
      }
    }).each(async result => {
      const review = result.dataValues;
      // console.log(moment(review.date).format("YYYY-MM-DD HH:mm"));
      await User.find({
        where: {
          user_id: review.user_id
        }
      }).then(user => {
        getreview.push(
          Object.assign({}, review, {
            username: user.dataValues.username,
            date: moment(review.date).format("YYYY-MM-DD HH:mm")
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

  // get movies by year range
  app.get('/moviebyyear', (req, res) => {
    const {
      start,
      end
    } = req.body;

    Movie.findAll({
      where: {
        year: { [Op.between]: [start, end] }
      }
    }).then(d => res.send(d));
  });

  // get movies by rating range
  app.get('/moviebyrating', (req, res) => {
    const {
      ratingStart,
      ratingEnd
    } = req.query;

    Movie.findAll({
      where: {
        rating: { [Op.between]: [ratingStart, ratingEnd] }
      }
    }).then(d => res.send(d));
  });

  // fav movies by gender, rating, age (ie female age > 10 ave rating >= 8)
  app.get('/advancedfav', (req, res) => {

    const {
      gender = 'f' || 'm',
      year_gap = 0,
      set_rating = 8
    } = req.body;

    let genderlist = [];
    let movielist = [];

    User.findAll({
      where: {
        gender: { [Op.iLike]: gender },
        dob: { [Op.lte]: moment().subtract(year_gap, 'years') }
      }
    }).each(d => genderlist.push(d.user_id))

      .then(() =>
        Review.findAll({
          where: { user_id: genderlist },
          group: ['movie_id'],
          attributes: ['movie_id', [Sequelize.fn('AVG', Sequelize.col('rating')), 'ave_rating']]
        }).each(d => {
          if (d.dataValues.ave_rating >= set_rating) { movielist.push(d.movie_id) }
        })
          .then(() =>
            Movie.findAll({
              where: { movie_id: movielist }
            }).then(d => res.send(d))
          )
      )
  });

  //movie by genre, rating, year
  app.get('/advanceSearchForMovies', (req, res) => {
    const {
      ratingStart,
      ratingEnd,
      yearStart,
      yearEnd,
      genres,
      actor,
      director
    } = req.query;
    let genreMovies = [];
    console.log(req.query);

    let whereStatement = {
      rating: { [Op.between]: [ratingStart, ratingEnd] },
      year: { [Op.between]: [yearStart, yearEnd] },
    };

    if (genres && director && actor) {
      whereStatement = Object.assign({}, whereStatement, {
        director: { [Op.iLike]: `%${director}%` },
        '$actor.actor_name$': { [Op.iLike]: `%${actor}%` },
        '$genre.genre$': genres,
      })
    } else if (!genres && director && actor) {
      whereStatement = Object.assign({}, whereStatement, {
        director: { [Op.iLike]: `%${director}%` },
        '$actor.actor_name$': { [Op.iLike]: `%${actor}%` }
      })
    } else if (genres && !director && actor) {
      whereStatement = Object.assign({}, whereStatement, {
        '$actor.actor_name$': { [Op.iLike]: `%${actor}%` },
        '$genre.genre$': genres,
      })
    } else if (genres && director && !actor) {
      whereStatement = Object.assign({}, whereStatement, {
        director: { [Op.iLike]: `%${director}%` },
        '$genre.genre$': genres
      })
    } else if (!genres && !director && actor) {
      whereStatement = Object.assign({}, whereStatement, {
        '$actor.actor_name$': { [Op.iLike]: `%${actor}%` }
      })
    } else if (genres && !director && !actor) {
      whereStatement = Object.assign({}, whereStatement, {
        '$genre.genre$': genres
      })
    } else if (!genres && director && !actor) {
      whereStatement = Object.assign({}, whereStatement, {
        director: { [Op.iLike]: `%${director}%` }
      })
    }

    Movie.findAll({
      where: whereStatement,
      include: [
        { model: Movie_cast, as: 'actor', attributes: ['actor_name'] },
        { model: Movie_genre, as: 'genre', attributes: ['genre'] },
        { model: Recommend, as: 'recommend', attributes: ['movie_id2'] }
      ]
    }).then(d => res.send(d));

  });
}