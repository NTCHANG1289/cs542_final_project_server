const util = require('util')
const jwt = require('jwt-simple');
const User = require('../models/user');
const Fav_genre = require('../models/fav_genre');

function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({
    sub: user.id,
    iat: timestamp
  }, process.env.JWT_SECRET);
};

exports.signin = (req, res, next) => {
  // let fav_genres = [];
  // req.user.getFav_genre().then(fav_genre => {
  //   fav_genres.push(fav_genre);
  // })
  // console.log(req.fav_genres);
  res.send({
    token: tokenForUser(req.user),
    user: req.user
  });
}


exports.signup = (req, res, next) => {
  const {
    username,
    email,
    password,
    dob,
    gender
  } = req.body;

  if (!email || !password) {
    return res.status(422).send({ error: 'You must provide email and password' })
  }

  User.findOne({
    where: { email }, include: [{
      model: Fav_genre,
      as: 'fav_genre'
    }]
  }).then((existingUser) => {
    // if (err) throw err;
    // console.log(existingUser);
    if (existingUser) {
      // return res.send(existingUser)
      return res.status(422).send({
        error: 'Email is in use'
      })
    }

    let fav_genres = [];
    const user = User.create({
      username,
      email,
      password,
      dob,
      gender
    }).then(async newUser => {
      fav_genres = await req.body.fav_genres.map(fav_genre => {
        return Fav_genre.create({
          user_id: newUser.get('user_id'),
          fav_genre
        }).then(genre => genre)
      });
      console.log('fav_genres', fav_genres);
      // Promise.all(promises)
      //   .then(function () {
      //     return Promise.resolve(result);
      //   }).catch(err =>
      //     console.log(err)
      //   );

      res.send({
        token: tokenForUser(newUser.get({
          plain: true
        })),
        user: newUser
      });
    }).catch(err => {
      console.log(err);
      res.status(422).send({
        error: 'Fail to sign up'
      });
    }
    )
  }).catch(err =>
    console.log(err)
  )
}