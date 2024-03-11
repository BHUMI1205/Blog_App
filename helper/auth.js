import passport from "passport";
import GoogleStrategy from 'passport-google-oauth20';
import {user} from "../model/user.js";

const authUser = (request, accessToken, refreshToken, profile, done) => {
  return done(null, profile);
};

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: process.env.CALLBACKURL,
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
      role: user.role,
      IsSubscribed:user.IsSubscribed
    }
    return done(null, user);
  }).catch((err) => {
    console.log(err);
    return false;
  });
});

export default passport;