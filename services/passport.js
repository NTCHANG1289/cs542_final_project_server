const Sequelize = require('sequelize');
const passport = require('passport');
const User = require('../models/user');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');
const Fav_genre = require('../models/fav_genre');

// Create local Strategy
const localLogin = new LocalStrategy({
  usernameField: 'email'
}, (email, password, done) => {
  // Verify this username and password, call done with the user
  // if it is the correct username and password
  // otherwise, call done with false
  User.findOne({
    where: { email },
    // include: [{
    //   model: Fav_genre,
    //   as: 'fav_genre'
    // }]
  }).then(user => {
    // console.log('aaaaaaa', user.getFav_genre().then(fav_genre => {
    //   // console.log(fav_genre)
    //   user.setFav_genre(fav_genre);
    // }
    // ));
    let fav_genres = [];
    // var promises = user.getFav_genre().each(fav_genre => {
    //   return fav_genres.push(fav_genre);
    // })

    // let result = Promise.all([promises])
    //   .then(function () {
    //     return Promise.resolve(result);
    //   }).catch(err =>
    //     console.log(err)
    //   );

    // result.then(result => console.log(result));
    // console.log(fav_genres);

    if (!user) {
      return done(null, false);
    }
    // console.log(user);

    // user.fav_genres = fav_genres;
    // console.log(user);
    user.validPassword(password, (err, isMatch) => {
      if (err) {
        return done(err);
      }
      if (!isMatch) {
        return done(null, false);
      }
      return done(null, user);

    })
  })
})

// Setup options fro JWT Strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: process.env.JWT_SECRET
};

// Create JWT Strategy
const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
  User.findById(payload.sub).then(user => {

    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  })
});

passport.use(jwtLogin);
passport.use(localLogin);