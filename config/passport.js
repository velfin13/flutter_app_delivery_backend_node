const jwtStrategy = require("passport-jwt").Strategy;
const extractJwt = require("passport-jwt").ExtractJwt;
const User = require("../models/user");

module.exports = (passport) => {
  let opts = {};
  opts.jwtFromRequest = extractJwt.fromAuthHeaderWithScheme("jwt");
  opts.secretOrKey = process.env.secretOrKey;

  passport.use(
    new jwtStrategy(opts, (jwt_payload, done) => {
      User.findUserByID(jwt_payload.id, (err, user) => {
        if (err) {
          return done(err, false);
        } else if (user) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      });
    })
  );
};
