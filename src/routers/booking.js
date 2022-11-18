const express = require("express")
const router = new express.Router()
const Booking = require("../models/booking")
const db = require('../db/mongodb.js')

// (C)
// call addBooking from mongodb.js
router.post('/bookings', (req, res) => {
    try {
        const booking = db.addBooking(req.body)
        res.status(201).send(booking)
    } catch (e) {
        res.status(400).send(e)
    }
})

// (R) GET bookings /bookings?renter_id=string&host_id=string&listing_id=string
// Filter booking by renter ID, host ID or listing ID
router.get('/bookings', async (req, res) => {
    const match = {}
    // TODO: convert strings to ObjectIds
    if (req.query.renter_id) {match.renter_id = req.query.renter_id}
    if (req.query.host_id) {match.host_id = req.query.host_id}
    if (req.query.listing_id) {match.listing_id = req.query.listing_id}
    try {
        const bookings = await Booking.find({ match })
        res.send(bookings)
    } catch (e) {
        res.status(500).send(e)
    }
})

// (R) GET booking by ID
router.get('/bookings/:id', async (req, res) => {
    const _id = req.params.id // mongoose automatically converts string ids into ObjectIds
    try {
        const booking = await Booking.findById(_id)
        if (!booking) {
            return res.status(404).send()
        }
        res.send(booking)
    } catch (e) {
        res.status(500).send(e)
    }
})


// (U)
router.patch('/bookings/:id', async (req, res) => {
    try {
        const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        if (!booking) {
            return res.status(404).send()
        }
        res.send(booking)
    } catch (e) {
        res.status(400).send(e)
    }
})

// (D)
router.delete('/bookings/:id', async (req, res) => {
    try {
        const booking = await Booking.findByIdAndDelete(req.params.id)
        if (!booking) {
            return res.status(404).send()
        }
        res.send(booking)
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router
