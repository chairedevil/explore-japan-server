const passport = require('passport')
const passportService = require('./service/passport')

const requireSignin = passport.authenticate('local', { session: false })
const requireAuth = passport.authenticate('jwt', { session: false })

const articles = require('./controllers/Articles')
const users = require('./controllers/Users')
const api = require('./controllers/Api')

module.exports = function (app) {
    
    app.get('/', (req, res) => {
        res.send({ message: 'exploreJapan Service' })
    })

    //Passport
    app.post('/signin', requireSignin, users.signin)

    //Article
    app.get('/articles', articles.findAll)

    //User
    app.post('/users', users.createUser)

    //API
    app.get('/autoplace', api.googleplace)

}