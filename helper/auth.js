const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const user = require("../model/user");

const authUser = (request, accessToken, refreshToken, profile, done) => {
  return done(null, profile);
};

passport.use(
  new GoogleStrategy(
    {
      clientID:
        "478744149082-fvh2ns8mg745ooh4qtkv63na5hjfjqu6.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "http://localhost:7500/auth/google/callback",
    },
    authUser
  )
);

passport.serializeUser((user, done) => {
  let email = user.emails[0].value;
  return done(null, email);
});

passport.deserializeUser((email, done) => {
  user.findOne({ email: email }).then((user) => {
    user = {
      id: user._id,
      role: user.role
    }
    return done(null, user);
  }).catch((err) => {
    console.log(err);
    return false;
  });
});

module.exports = passport;