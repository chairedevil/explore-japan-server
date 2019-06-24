//import axios from 'axios'
//import config from '../config'
const axios = require('axios')
const config = require('../config')

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