const User = require('../models/user');

exports.signup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res.status(422).send({ error: 'You must provide email and password' })
  }

  User.findOne({ where: { email } }).then((existingUser) => {
    // if (err) throw err;
    // console.log(user);
    if (existingUser) {
      // return res.send(existingUser)
      return res.status(422).send({ error: 'Email is in use' })
    }

    const user = User.create({
      email,
      password
    }).then(newUser => {
      // console.log(newUser.get({
      //   plain: true
      // }))
      res.send(newUser.get({
        plain: true
      }));
    });

  })
}