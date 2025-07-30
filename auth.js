const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

passport.use(new DiscordStrategy({
    clientID: process.env.ClientID,
    clientSecret: process.env.clientSecret,
    callbackURL: process.env.CallbackURL,
    scope: ['identify']
}, (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
}));

module.exports = passport;
