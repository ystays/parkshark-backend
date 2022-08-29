const express = require('express')
const path = require('path')
const hbs = require('hbs')
require('dotenv').config()

const forecast = require('./utils/forecast.js')
const geocode = require('./utils/geocode.js')

const app = express()
const port = process.env.PORT || 3000

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, "../public")
const viewsPath = path.join(__dirname, "../templates/views")
const partialsPath = path.join(__dirname, "../templates/partials")

// Setup handlebars engine and views location
app.set("view engine", "hbs")
app.set("views", viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get("", (req, res) => {
    res.render("index", {
        title: "Weather App",
        name: "ystays"
    })
})

app.get("/about", (req, res) => {
    res.render("about", {
        title: "About Me",
        name: "ystays"
    })
})

app.get("/help", (req, res) => {
    res.render("help", {
        title: "Help Page",
        name: "ystays",
        helpText: "This is helpful."
    })
})

app.get("/weatherapp", (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: "An address must be provided."
        })
    }
    else {
        geocode(req.query.address, (error, {latitude, longitude, location} = {}) => {
            if (error) {
              return res.send({ error })
            }
            
            forecast(latitude, longitude, (error, forecastData) => {
              if (error) {
                return res.send({error})
              }
              res.send({
                address: req.query.address,
                location,
                forecast: forecastData
              })
            })
          
          })
    }
})

app.get("/products", (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: "You must provide a search term."
        })
    }

    console.log(req.query.search)
    res.send({
        products: []
    })
})

app.get("/help/*", (req, res) => {
    res.render("error404", {
        title: "Error 404",
        name: "ystays",
        errorText: "Help article not found."
    })
})

app.get("*", (req, res) => {
    res.render("error404", {
        title: "Error 404",
        name: "ystays",
        errorText: "Page not found."
    })
})

app.listen(port, () => {
    console.log("Server is up on port " + port + ".")
})