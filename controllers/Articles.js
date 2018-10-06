exports.findAll = (req, res, next) => {
    req.getConnection((err, connection) => {
        if(err) return next(err)

        //API : http://localhost:3010/articles?search=tokyo+japan

        words = req.query.search.split(" ");
        params = [];

        sql = `SELECT * FROM articles
            LEFT JOIN prefectures ON articles.prefectureId = prefectures.prefectureId`

        if(words[0] != ''){
            sql = sql + ` WHERE`

            for(var i in words){
                word = `%${words[i]}%`
                params.push(word,word,word)
                sql = sql + ` LOWER(articles.title) LIKE ? OR
                    prefectures.nameEn LIKE ? OR
                    tags LIKE ? OR`
            }

            sql = sql.slice(0 ,-3)

        }

        sql = sql + ' ORDER BY articles.createdDateTime DESC';

        //console.log(sql)
        //console.log(params)

        connection.query(sql, params, (err, result) => {
            if(err) return next(err)
            res.send(result)
        })
    })
}