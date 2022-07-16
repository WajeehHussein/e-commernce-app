'use strict';
require('dotenv').config()
const router = require('express').Router();
const User = require('../models/User');
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');

// REGISTER // SignUp
router.post('/register', async (req, res) => {
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString(),
    });

    try {
        const savedUser = await newUser.save();
        res.status(201).json(savedUser)
    } catch (err) {
        res.status(500).json(err);
    }

})

router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        !user && res.status(401).json("'wrong credentials!"); // like if statement condition && statement

        const hashedPassword = CryptoJS.AES.decrypt(user.password, process.env.PASS_SEC);
        const userPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
        userPassword !== req.body.password && res.status(401).json("'wrong credentials!");

        const accessToken = jwt.sign({
            id: user._id,
            isAdmin: user.isAdmin,
        }, process.env.PASS_SEC,
            { expiresIn: "1d" })

        const { password, ...others } = user._doc    // show DB without password //_doc =>in mongoDB json
        res.status(200).json({ ...others, accessToken })
    } catch (err) {
        res.status(500).json(err)
    }

})




module.exports = router