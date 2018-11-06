exports.findAll = (req, res, next) => {
    req.getConnection((err, connection) => {
        if(err) return next(err)

        //API : http://localhost:3010/articles?search=tokyo+japan
        
        let params = [];
        let words = req.query.search.split(" ");
        if(words == ''){
            wordsExp = ' '
        }else{
            wordsExp = words.join("|").toLowerCase()
        }

        //console.log(wordsExp, req.query.start, req.query.end)

        const sPnt = req.query.start
        const ePnt = req.query.end

        if(req.query.start == '' && req.query.end == ''){
            params.push( wordsExp, wordsExp, wordsExp, wordsExp )
            sql = `SELECT * FROM articles
            LEFT JOIN prefectures ON articles.prefectureId = prefectures.prefectureId
            WHERE articles.title REGEXP ? OR
                prefectures.nameEn REGEXP ? OR
                prefectures.nameJp REGEXP ? OR
                articles.tags REGEXP ?
            ORDER BY articles.createdDateTime DESC`
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
                    AND (articles.scopeDateStart IS NULL AND articles.scopeDateEnd IS NULL))
            ORDER BY articles.createdDateTime DESC`
        }

        //console.log(sql)
        //console.log(params)

        connection.query(sql, params, (err, result) => {
            if(err) return next(err)
            res.send(result)
        })
    })
}