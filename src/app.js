const express = require('express')
const path = require('path')
const hbs = require('hbs')
require('dotenv').config()

const forecast = require('./utils/forecast.js')
const geocode = require('./utils/geocode.js')

const app = express()

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
        name: "Yi Sheng TAY"
    })
})

app.get("/about", (req, res) => {
    res.render("about", {
        title: "About Me",
        name: "Yi Sheng TAY"
    })
})

app.get("/help", (req, res) => {
    res.render("help", {
        title: "Help Page",
        name: "Yi Sheng TAY",
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
        name: "Yi Sheng TAY",
        errorText: "Help article not found."
    })
})

app.get("*", (req, res) => {
    res.render("error404", {
        title: "Error 404",
        name: "Yi Sheng TAY",
        errorText: "Page not found."
    })
})

app.listen(3000, () => {
    console.log("Server is up on port 3000.")
})