const express = require("express")
const { createUser } = require("../db/mongodb")
const router = new express.Router()
const User = require("../models/user")

// (C) POST new user
router.post('/users', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        res.status(201).send(user)
    } catch (e) {
        res.status(400).send(e)
    }
})

// (R) GET users /users?email=string 
// Find by email
router.get('/users', async (req, res) => {
    const match = {}
    if (req.query.email) {
        match.email = req.query.email
    }
    try {
        const users = await User.find({ match })
        res.send(users)
    } catch (e) {
        res.status(500).send(e)
    }
})

// (R) GET individual user by ID
router.get('/users/:id', async (req, res) => {
    const _id = req.params.id // mongoose automatically converts string ids into ObjectIds
    try {
        const user = await User.findById(_id)
        if (!user) {
            return res.status(404).send()
        }
        res.send(user)
    } catch (e) {
        res.status(500).send(e)
    }
})

// (U) PATCH user by ID
router.patch('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        if (!user) {
            return res.status(404).send()
        }
        res.send(user)
    } catch (e) {
        res.status(400).send(e)
    }
})

// (D) DELETE user by ID
router.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id)
        if (!user) {
            return res.status(404).send()
        }
        res.send(user)
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router