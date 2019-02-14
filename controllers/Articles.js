const axios = require('axios')
const config = require('../config')

exports.findAll = (req, res, next) => {
    req.getConnection((err, connection) => {
        if(err) return next(err)

        //API : http://localhost:3010/articles?search=tokyo+japan

        const idx = parseInt(req.query.idx)
        const sPnt = req.query.start
        const ePnt = req.query.end
        const rnd = req.query.rnd
        const id = req.query.id | 0

        let params = [];
        let words = req.query.search.split(" ");
        if(words == ''){
            if(req.query.start == '' && req.query.end == ''){
                params.push( id )
                sql = `SELECT * FROM articles
                LEFT JOIN prefectures ON articles.prefectureId = prefectures.prefectureId
                WHERE articles.articleId <> ?`
            }else{
                params.push( sPnt, ePnt, sPnt, ePnt, sPnt, ePnt )
                sql = `SELECT * FROM articles
                LEFT JOIN prefectures ON articles.prefectureId = prefectures.prefectureId
                WHERE ((articles.articleType=0)
                        AND ((DayOfYear(?) BETWEEN DayOfYear(articles.scopeDateStart) AND DayOfYear(articles.scopeDateEnd)) OR (DayOfYear(?) BETWEEN DayOfYear(articles.scopeDateStart) AND DayOfYear(articles.scopeDateEnd))))
                        OR
                        ((articles.articleType=1)
                        AND ((DayOfYear(articles.scopeDateStart) BETWEEN DayOfYear(?) AND DayOfYear(?))))
                        OR
                        ((articles.articleType=2)
                        AND ((? BETWEEN articles.scopeDateStart AND articles.scopeDateEnd) OR (? BETWEEN articles.scopeDateStart AND articles.scopeDateEnd)))
                        OR
                        (articles.scopeDateStart IS NULL AND articles.scopeDateEnd IS NULL)`
            }
        }else{
            wordsExp = words.join("|").toLowerCase()

            if(req.query.start == '' && req.query.end == ''){
                params.push( wordsExp, wordsExp, wordsExp, wordsExp, id )
                sql = `SELECT * FROM articles
                LEFT JOIN prefectures ON articles.prefectureId = prefectures.prefectureId
                WHERE ( articles.title REGEXP ? OR
                    prefectures.nameEn REGEXP ? OR
                    prefectures.nameJp REGEXP ? OR
                    articles.tags REGEXP ? ) AND
                    articles.articleId <> ?`
            }else{
                params.push( wordsExp, wordsExp, wordsExp, wordsExp, sPnt, ePnt, wordsExp, wordsExp, wordsExp, wordsExp, sPnt, ePnt, wordsExp, wordsExp, wordsExp, wordsExp, sPnt, ePnt, wordsExp, wordsExp, wordsExp, wordsExp)
                sql = `SELECT * FROM articles
                LEFT JOIN prefectures ON articles.prefectureId = prefectures.prefectureId
                WHERE ((articles.articleType=0) AND (articles.title REGEXP ? OR
                        prefectures.nameEn REGEXP ? OR
                        prefectures.nameJp REGEXP ? OR
                        articles.tags REGEXP ?)
                        AND ((DayOfYear(?) BETWEEN DayOfYear(articles.scopeDateStart) AND DayOfYear(articles.scopeDateEnd)) OR (DayOfYear(?) BETWEEN DayOfYear(articles.scopeDateStart) AND DayOfYear(articles.scopeDateEnd))))
                        OR
                        ((articles.articleType=1) AND (articles.title REGEXP ? OR
                        prefectures.nameEn REGEXP ? OR
                        prefectures.nameJp REGEXP ? OR
                        articles.tags REGEXP ?)
                        AND ((DayOfYear(articles.scopeDateStart) BETWEEN DayOfYear(?) AND DayOfYear(?))))
                        OR
                        ((articles.articleType=2) AND (articles.title REGEXP ? OR
                        prefectures.nameEn REGEXP ? OR
                        prefectures.nameJp REGEXP ? OR
                        articles.tags REGEXP ?)
                        AND ((? BETWEEN articles.scopeDateStart AND articles.scopeDateEnd) OR (? BETWEEN articles.scopeDateStart AND articles.scopeDateEnd)))
                        OR
                        ((articles.title REGEXP ? OR
                        prefectures.nameEn REGEXP ? OR
                        prefectures.nameJp REGEXP ? OR
                        articles.tags REGEXP ?)
                        AND (articles.scopeDateStart IS NULL AND articles.scopeDateEnd IS NULL))`
            }
        }



        if(typeof rnd !== 'undefined'){
            sql = sql + ' ORDER BY RAND() LIMIT 3'
        }else{
            sql = sql + ' ORDER BY articles.createdDateTime DESC LIMIT ' + idx
        }

        //console.log(sql)
        //console.log(params)

        connection.query(sql, params, (err, result) => {
            if(err) return next(err)
            res.send(result)
        })
    })
}

exports.getArticle = (req, res, next) => {
    req.getConnection((err, connection) => {
        if(err) return next(err)

        const articleId = req.query.id
        const sql = `SELECT *
            FROM articles
            INNER JOIN prefectures ON articles.prefectureId = prefectures.prefectureId
            WHERE articleId = ?`

        connection.query(sql, [articleId], (err, result) => {
            if(err) return next(err)
            res.send(result)
        })
    })
}

exports.getComments = (req, res, next) => {
    req.getConnection((err, connection) => {
        if(err) return next(err)

        const articleId = req.query.id

        const sql = `SELECT comments.commentTime AS datetime, comments.commentText AS content, users.username AS author, users.avaPath AS avatar FROM comments
        INNER JOIN users ON comments.userId=users.userId
        WHERE comments.articleId = ?
        ORDER BY comments.commentTime DESC`

        connection.query(sql, [articleId], (err, result) => {
            if(err) return next(err)
            res.send(result)
        })
    })
}

exports.getSaved = (req, res, next) => {
    req.getConnection((err, connection) => {
        if(err) return next(err)

        const articleId = req.query.aid
        const userId = req.query.uid

        const sql = `SELECT COUNT(userId) AS saved
        FROM saved
        WHERE articleId = ? AND userId = ?`

        connection.query(sql, [articleId, userId], (err, result) => {
            if(err) return next(err)

            //console.log(result[0].saved)
            if(result[0].saved){
                res.send(true)
            }else{
                res.send(false)
            }
        })
    })
}

exports.getPopular = (req, res, next) => {
    req.getConnection((err, connection) => {
        if(err) return next(err)

        const sql = `SELECT COUNT(saved.userId) AS count, articles.articleId, articles.title, articles.coverPath, articles.content, users.avaPath, users.username
        FROM saved
        INNER JOIN articles ON articles.articleId = saved.articleId
        INNER JOIN users ON users.userId = articles.userId
        WHERE articles.articleType = 0 OR articles.articleType = 2
        GROUP BY saved.articleId
        ORDER BY count DESC LIMIT 10`

        connection.query(sql, (err, result) => {
            if(err) return next(err)
            res.send(result)
        })

    })
}

exports.getPopular2 = (req, res, next) => {
    req.getConnection((err, connection) => {
        if(err) return next(err)

        const sql = `SELECT COUNT(saved.userId) AS count, articles.articleId, articles.title, articles.coverPath, articles.content, users.avaPath, users.username
        FROM saved
        INNER JOIN articles ON articles.articleId = saved.articleId
        INNER JOIN users ON users.userId = articles.userId
        WHERE articles.articleType = 1
        GROUP BY saved.articleId
        ORDER BY count DESC LIMIT 10`

        connection.query(sql, (err, result) => {
            if(err) return next(err)
            res.send(result)
        })

    })
}

exports.createSaved = (req, res, next) => {
    req.getConnection((err, connection) => {
        if(err) return next(err)

        const articleId = req.query.aid
        const userId = req.query.uid

        const sql = `INSERT INTO saved VALUES(?, ?, null)`

        connection.query(sql, [userId, articleId], (err, result) => {
            if(err) return next(err)
            res.send(result)
        })
    })
}

exports.deleteSaved = (req, res, next) => {
    req.getConnection((err, connection) => {
        if(err) return next(err)

        const articleId = req.query.aid
        const userId = req.query.uid

        const sql = `DELETE FROM saved
        WHERE articleId = ? AND userId = ?`

        connection.query(sql, [articleId, userId], (err, result) => {
            if(err) return next(err)
            res.send(result)
        })
    })
}

exports.createArticle = (req, res, next) => {
    req.getConnection((err, connection) => {
        if(err) return next(err)

        let lang = null

        if(req.body.content){
            axios.get('https://translation.googleapis.com/language/translate/v2/detect', {
                params:{
                    key: config.GOOGLE_API_TOKEN,
                    q: req.body.content.substring(34,200)
                }
            })
            .then(({data})=>{
    
                if(data.data.detections[0][0].language === 'ja'){
                    lang = 2
                }else{
                    lang = 1
                }
    
                const insertData = {
                    title: req.body.title,
                    coverPath: req.body.coverPath,
                    content: req.body.content,
                    scopeDateStart: req.body.scopeDateStart,
                    scopeDateEnd: req.body.scopeDateEnd,
                    articleType: req.body.articleType,
                    userId: req.body.userId,
                    prefectureId: req.body.prefectureId,
                    lat: req.body.lat,
                    lng: req.body.lng,
                    tags: req.body.tags,
                    lang: lang
                }
    
                req.getConnection((err, connection) => {
                    if(err) return next(err)
            
                    connection.query("INSERT INTO articles set ?", insertData, (err, results) => {
                        if(err) return next(err)
                        res.send(results)
                    })
                })
    
            })
        }else{

            const insertData = {
                title: req.body.title,
                coverPath: req.body.coverPath,
                content: req.body.content,
                scopeDateStart: req.body.scopeDateStart,
                scopeDateEnd: req.body.scopeDateEnd,
                articleType: req.body.articleType,
                userId: req.body.userId,
                prefectureId: req.body.prefectureId,
                lat: req.body.lat,
                lng: req.body.lng,
                tags: req.body.tags,
                lang: lang
            }
            req.getConnection((err, connection) => {
                if(err) return next(err)
        
                connection.query("INSERT INTO articles set ?", insertData, (err, results) => {
                    if(err) return next(err)
                    res.send(results)
                })
            })

        }


    })
}

exports.comment = (req, res, next) => {
    req.getConnection((err, connection) => {
        if(err) return next(err)

        const articleId = req.body.articleId
        const userId = req.body.userId
        const content = req.body.content

        //console.log(articleId, userId, content)

        connection.query("INSERT INTO comments(articleId, userId, commentText) VALUES(?, ?, ?)", [articleId, userId, content], (err, results) => {
            if(err) return next(err)
            res.send(results)
        })
    })
}

exports.uploadImgInPost = (req, res, next) => {
    //console.log("Request file ---", req.file)
    res.status(200)
    res.json({ 'imgFilename': req.file.filename })
}