require('dotenv').config()
const geocode = require('./utils/geocode.js')
const express = require("express")
const db = require('./db/mongodb.js')  // ensures mongoose connects to the db

const userRouter = require('./routers/user')
const listingRouter = require('./routers/listing')
const bookingRouter = require('./routers/booking')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(userRouter)
app.use(listingRouter)
app.use(bookingRouter)

app.listen(port, () => {
  console.log("Server is up on port " + port)
})