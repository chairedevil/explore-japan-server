//import axios from 'axios'
//import config from '../config'
const axios = require('axios')
const config = require('../config')

exports.googleplace = (req, res, next) => {

        //API : http://localhost:3010/autoplace?chr=abcd

        chr = req.query.chr.trim()

        axios.get('https://maps.googleapis.com/maps/api/place/autocomplete/json',{
            params:{
                language: 'ja',
                input: chr,
                key: config.GOOGLE_API_TOKEN,
                sessiontoken: '1234567890'
            }
        })
        .then(({data})=>{

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