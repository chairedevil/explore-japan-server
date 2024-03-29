const bcrypt = require('bcrypt')
const jwt = require('jwt-simple')
const config = require('../config')

function generateToken(user){
    const timestamp = Math.round(Date.now() / 1000)
    const exp = Math.round(Date.now() / 1000) + (60 * 60 * 24 * 7)
    return jwt.encode(
        /*{
            sub: user.id,
            userid: user.username,
            isAdmin: user.isAdmin,
            iat: timestamp
        },*/
        { sub: user.userId, ...serialize(['userId', 'password'], user), iat: timestamp, exp},
        config.secret
    )
}

function serialize(delParams, user){
    //console.log(user)
    let serializedUser = user
    delParams.forEach((key)=>{
        delete serializedUser[key]
    })
    return serializedUser
}

exports.signin = (req, res, next) => {
    res.status(201)
    res.json({ 'token': generateToken(req.user) })
}

exports.createUser = (req, res, next) => {

    //console.log(req.body)    
    bcrypt.hash(req.body.password, 10, (err, hash) => {
        if(err) return next(err)

        const insertData = {
            username: req.body.username,
            password: hash,
            email: req.body.email,
            avaPath: req.body.avaPath
        }

        req.getConnection((err, connection) => {
            if(err) return next(err)
    
            connection.query("INSERT INTO users set ?", insertData, (err, results) => {
                if(err) return next(err)
                res.send(results)
            })
        })
    })

}

exports.checkUsername = (req, res, next) => {

    //API : http://localhost:3010/check?username=abcd

    const checkUsername = req.query.username

    req.getConnection((err, connection) => {
        if(err) return next(err)

        connection.query("SELECT userId FROM users WHERE username = ?",checkUsername,(err, results) => {
            if(err) return next(err)
            
            if(results.length > 0){
                res.send(true)
            }else{
                res.send(false)
            }
        })
    })
}

exports.uploadAvatar = (req, res, next) => {
    //console.log("Request file ---", req.file)
    res.status(200)
    res.json({ 'imgFilename': req.file.filename })
}

exports.getSavedList = (req, res, next) => {
    req.getConnection((err, connection) => {
        if(err) return next(err)

        const userId = req.query.uid

        const sql = `SELECT *
        FROM saved
        INNER JOIN articles ON articles.articleId = saved.articleId
        WHERE saved.userId = ?
        ORDER BY saved.savedTime DESC`

        connection.query(sql, [userId], (err, result) => {
            if(err) return next(err)
            res.send(result)
        })
    })
}