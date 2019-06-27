//import axios from 'axios'
//import config from '../config'
const axios = require('axios')
const OAuth = require('oauth')
const config = require('../config')

const clientID = 'CG7i3j2bl0eYIv99vjMSvbY1I'
const clientSecret = 'RULVj5gepeAgg39xgRpR53F1aNILj2qOJhaAdGA8alnNHVBHhG'
const accessToken = '62762346-tARVF3nuh0Uuul6834tw4gmr8prKwREBOoSiv73mH'
const accessTokenSecret = 'EoTp7Evg15OCW04zMYshyK8h4FifhB3SXfaYNMfRKlZWy'

const oauth = new OAuth.OAuth(
    'https://api.twitter.com/oauth/request_token',
    'https://api.twitter.com/oauth/access_token',
    clientID,
    clientSecret,
    '1.0A',
    null,
    'HMAC-SHA1'
  );

exports.googleplace = (req, res, next) => {

    //API : http://localhost:3010/autoplace?chr=abcd

    chr = req.query.chr.trim()

    axios.get('https://maps.googleapis.com/maps/api/place/autocomplete/json',{
        params:{
            //language: 'ja',
            input: chr,
            key: config.GOOGLE_API_TOKEN,
            sessiontoken: '1234567890'
        }
    })
    .then(({data})=>{

        //res.send(data)

        suggestArg = [chr.replace(/^\w/, c => c.toUpperCase())]
        suggestArgFilter = []
        data.predictions.forEach((r)=>{
            suggestArg.push(r.structured_formatting.main_text)
        })

        suggestArgFilter = suggestArg.filter((item, pos)=>{
            return suggestArg.indexOf(item) == pos
        })

        res.send(suggestArgFilter)
    })

}

exports.getGeo = (req, res, next) => {

    //API : http://localhost:3010/getgeo?chr=abcd

    chr = req.query.chr.trim()

    axios.get('https://maps.googleapis.com/maps/api/place/findplacefromtext/json?',{
        params:{
            //language: 'ja',
            input: chr,
            key: config.GOOGLE_API_TOKEN,
            inputtype: 'textquery',
            sessiontoken: '1234567890',
            fields: 'photos,formatted_address,name,opening_hours,geometry'
        }
    })
    .then(({data})=>{

        res.send(data)

    })

}

exports.getTweetByGeo = (req, res, next) => {

    //API : http://localhost:5000/gettweet?geo=(lat,lng)

    const geo = req.query.geo

    oauth.get(
        `https://api.twitter.com/1.1/search/tweets.json?geocode=${geo},1km&result_type=mixed&count=50`,
        accessToken, 
        accessTokenSecret, 
        (e, data, inLoopRes) => {
            if (e) console.error(e);
            //parsejsonData = JSON.parse(data)
            const filteredData = JSON.parse(data).statuses.filter((data)=> { return data.geo != null})
            res.send(filteredData)
        });

}

exports.getTweetByUser = (req, res, next) => {

    //API : http://localhost:5000/gettimeline?user=()
    //http://localhost:5000/gettimeline?user=kapookdotcom

    const username = req.query.user

    oauth.get(
        `https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=${username}&count=30`,
        accessToken, 
        accessTokenSecret, 
        (e, data, inLoopRes) => {
            if (e) console.error(e);
            res.send(JSON.parse(data))
        });

}

exports.getPrefectureName = (req, res, next) => {

    //API : http://localhost:3010/getPrefectureName?lat=()lng=()

    lat = req.query.lat.trim()
    lng = req.query.lng.trim()

    axios.get('https://maps.googleapis.com/maps/api/geocode/json',{
        params:{
            //language: 'ja',
            latlng: `${lat},${lng}`,
            key: config.GOOGLE_API_TOKEN,
            result_type: "administrative_area_level_1"
        }
    })
    .then(({data})=>{
        res.send(data)
    })

}

exports.getWeather = (req, res, next) => {

    //API : http://localhost:3010/getWeather?city=()

    city = req.query.city.trim()

    axios.get('https://api.openweathermap.org/data/2.5/forecast',{
        params:{
            appid : config.openWeatherMapKey,
            q: city + ",392"
        }
    })
    .then(({data})=>{
        res.send(data)
    })
    .catch(error => {
        res.status(404).send([])
    })

}