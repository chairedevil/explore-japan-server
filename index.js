const PORT = process.env.PORT || 5000
const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const mysql = require('mysql')
const myConnection = require('express-myconnection')
var path = require('path')

const config = require('./config')
const routes = require('./routes')

app.use(cors())

//multerMiddleware
const users = require('./controllers/Users')
const articles = require('./controllers/Articles')
const multer  = require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log(req.route.path)
        console.log(file)
        if(req.route.path === '/users/avatar'){
            cb(null, 'assets/avatar/')
        }
        if(req.route.path === '/upload/img'){
            cb(null, 'assets/img/')
        }
    },
    onError : function(err, next) {
        console.log('error', err)
        next(err)
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname))
    }
})
const upload = multer({ storage: storage })

app.post('/users/avatar', upload.single('avatar'), users.uploadAvatar)
app.post('/upload/img', upload.single('image'), articles.uploadImgInPost)

app.use(express.static('assets'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json({ type: '*/*' }))
app.use(myConnection(mysql, config.dbOptions, 'pool'))

routes(app)

app.listen(PORT, () => {
    console.log('ready server on http://localhost:' + PORT)
})