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
      as: 'fav_genres'
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

    const user = User.create({
      username,
      email,
      password,
      dob,
      gender
    }).then(newUser => {
      // Fav_genre.create({
      //   user_id: newUser.get('user_id'),
      //   fav_genre: req.body.fav_Genres
      // })
      var promises = req.body.fav_Genres.map(fav_genre => {
        return Fav_genre.create({
          user_id: newUser.get('user_id'),
          fav_genre
        }).then(newFavGenre =>
          console.log(newFavGenre)
        ).catch(err =>
          console.log(err)
        );
      });

      Promise.all(promises)
        .then(function () {
          return Promise.resolve(result);
        }).catch(err =>
          console.log(err)
        );

      res.send({
        token: tokenForUser(newUser.get({
          plain: true
        })),
        user: newUser
      });
    }).catch(err =>
      console.log(err)
    )
  }).catch(err =>
    console.log(err)
  )
})
}