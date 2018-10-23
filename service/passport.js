const passport = require('passport')
const LocalStrategy = require('passport-local')
var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
const bcrypt = require('bcrypt');
const config = require('../config')

const passportLocalOptions = { passReqToCallback: true }
const passportLocalSignin = new LocalStrategy(passportLocalOptions, function(req, username, password, done){
    req.getConnection((err, connection) => {
        if(err) return next(err)

        connection.query("SELECT * from users WHERE username=? OR email=?", [username,username], (err, row) => {
            if(err) return next(err)

            if(!row.length) return done(null, false)

            bcrypt.compare(password, row[0].password, (err, res) => {
                if(err) return next(err)
                return done(null, row[0])
            })
        })
    })
})

var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
opts.secretOrKey = config.secret
opts.passReqToCallback = true

const passportJwt = new JwtStrategy(opts, function(req, jwt_payload, done) {
    req.getConnection((err, connection) => {
        if(err) return next(err)

        connection.query("SELECT * from users WHERE userId=?", [jwt_payload.sub], (err, row) => {
            if(err) return next(err)
            if(!row.length) return done(null, false)

            return done(null, row[0])
        })
    })
})

passport.use(passportLocalSignin)
passport.use(passportJwt)