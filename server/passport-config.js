const LocalStrategy = require('passport-local').Strategy;
const passport = require('passport');
const db = require('./app')

function initialize(passport, username, password) {
    const authenticate = async (username, password, done) => {
        const U = `SELECT username FROM customers WHERE username = ${username};`;
        const P = `SELECT password FROM customers WHERE password = ${password} AND username = ${username};`;
        let verify = 0;
        db.query(U, (err, data) => {
            if (!data) {
                verify = 1;
            }
        })
        db.query(P, (err, data) => {
            if (!data) {
                verify = 2;
            }
        })
        if (verify = 0) {
            return done(null, user)
        } else if (verify = 1) {
            return done(null, false, { msg: 'No username'})
        } else if (verify = 2) {
            return done(null, false, { msg: 'No password'})
        }
        };
    
    passport.use(new LocalStrategy(authenticate));
    
    passport.serializeUser( function(user, done) { return done (null, user)});
    passport.deserializeUser( function(user, done) { return done(null, user)});
}

module.exports = initialize;