const request = require('request')

const forecast = (latitude, longitude, callback) => {
    const url = "http://api.weatherstack.com/current?access_key=" + process.env.WEATHERSTACK_ACCESS_KEY +"&query=" + latitude + "," + longitude + "&units=f"
    request({ url, json: true}, (error, {body}) => {
        if (error) {
            callback("Unable to connect to weather service!", undefined)
        } else if (body.error) {
            callback("Error: %s (%s)", body.error.type, body.error.info, undefined)
        } else {
            const data = body.current
            callback(undefined, data.weather_descriptions[0] + ". It is currently " + data.temperature + " degrees out. It feels like " + data.feelslike + " degrees out.")
        }
    })
}

module.exports = forecast