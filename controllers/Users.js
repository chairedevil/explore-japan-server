const bcrypt = require('bcrypt')
const jwt = require('jwt-simple')
const config = require('../config')

function generateToken(user){
    const timestamp = new Date().getTime()
    return jwt.encode(
        /*{
            sub: user.id,
            userid: user.username,
            isAdmin: user.isAdmin,
            iat: timestamp
        },*/
        { sub: user.userId, ...serialize(['userId', 'password'], user), iat: timestamp },
        config.secret
    )
}

function serialize(delParams, user){
    console.log(user)
    let serializedUser = user
    delParams.forEach((key)=>{
        delete serializedUser[key]
    })
    return serializedUser
}

exports.signin = (req, res, next) => {
    res.header('Authentication', `Bearer ${generateToken(req.user)}`)
    res.status(201)
    res.json(serialize(['password'], req.user))
}

exports.createUser = (req, res, next) => {
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