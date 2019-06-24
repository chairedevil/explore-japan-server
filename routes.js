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
    app.get('/article', articles.getArticle)
    app.post('/article', articles.createArticle)
    app.get('/comments', articles.getComments)
    app.post('/comment', articles.comment)
    app.get('/save', articles.getSaved)
    app.post('/save', articles.createSaved)
    app.delete('/save', articles.deleteSaved)
    app.get('/popular', articles.getPopular)
    app.get('/popular2', articles.getPopular2)

    //User
    app.get('/check', users.checkUsername)
    app.post('/users', users.createUser)
    app.get('/savedlist', users.getSavedList)

    //API
    app.get('/autoplace', api.googleplace)
    app.get('/getgeo', api.getGeo)
    app.get('/getPrefectureName', api.getPrefectureName)
    app.get('/getWeather', api.getWeather)

}