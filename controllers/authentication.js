const jwt = require('jwt-simple');
const User = require('../models/user');

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
    gender,
    favGenre
  } = req.body;

  if (!email || !password) {
    return res.status(422).send({ error: 'You must provide email and password' })
  }

  User.findOne({ where: { email } }).then((existingUser) => {
    // if (err) throw err;
    // console.log(user);
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
      // console.log(newUser.get({
      //   plain: true
      // }))
      res.send({
        token: tokenForUser(newUser.get({
          plain: true
        })),
        user: newUser
      });
    });

  })
}