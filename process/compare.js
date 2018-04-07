const request = require('request')
const Config = require('./config-compare.json')

exports.compareFace = async (data) => {
    return new Promise((resolve, reject) => {
        let options = {
            method: 'POST',
            url: 'https://api-us.faceplusplus.com/facepp/v3/compare',
            form: {
                api_key: Config.api_key,
                api_secret: Config.api_secret,
                image_url1: data.image_url1,
                image_url2: data.image_url2
            }
        }

        request(options, function (error, response, body) {
            if (error) return reject(error);
            
            body = JSON.parse(body)
            // console.log(body)
            if (body.error_message) {
                // console.log(body)
                return reject({
                    status : 500,
                    error_message : data.hash + ' ' + body.error_message
                })
            }
            let result = {
                confidence : body.confidence,
                image_id2 : body.image_id2,
                image_id1 : body.image_id1,
                hash : data.hash
            }
            return resolve(result)
        })
    })
}