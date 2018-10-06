const articles = require('./controllers/Articles')

module.exports = function (app) {
    
    app.get('/', (req, res) => {
        res.send({ message: 'exploreJapan Server Service' })
    })

    app.get('/articles', articles.findAll)

}