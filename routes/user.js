'use strict';
const router = require('express').Router();
const User = require('../models/User');
const { verifyToken, authorization, authorizationAdmin } = require('./verifyToken')


// edit
router.put('/:id', authorization, async (req, res) => {
    if (req.body.password) {
        req.body.password = CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString();
    }
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, { new: true });
        res.status(200).json(updatedUser);
    } catch (err) { res.status(500).json(err) }
});

//DELETE

router.delete('/:id', authorization, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id)
        res.status(200).json("User has been deleted...");
    } catch (err) { res.status(500).json(err) }
})

//GET USER

router.get('/:id', authorizationAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        const { password, ...others } = user._doc
        res.status(200).json(others)
    } catch (err) { res.status(500).json(err) }
})

//GET ALL USER

router.get('/', authorizationAdmin, async (req, res) => {
    try {
        const users = await User.find()
        res.status(200).json(users)
    } catch (err) { res.status(500).json(err) }
})

// GET USER STATS

router.get('/stats', authorizationAdmin, async (req, res) => {
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

    try {
        const data = await User.aggregate([
            { $match: { createdAt: { $gte: lastYear } } },
            {
                $project: { month: { $month: '$createdAt' }, },
            },
            {
                $group: {
                    _id: '$month',
                    total: { $sum: 1 },
                },
            },
        ]);
        res.status(200).json(data)

    } catch (err) {
        res.status(500).json(err)
    }
})


module.exports = router