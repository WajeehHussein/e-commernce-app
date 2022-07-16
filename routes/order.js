'use strict';
const router = require('express').Router();
const Order = require('../models/Order');
const { verifyToken, authorization, authorizationAdmin } = require('./verifyToken')

//CREATE

router.post('/', authorization, async (req, res) => {
    const newOrder = new Order(req.body);
    try {
        const savedOrder = await newOrder.save();
        res.status(200).json(savedOrder)
    } catch (err) {
        res.status(500).json(err);
    }
})

// edit
router.put('/:id', authorizationAdmin, async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, { new: true });
        res.status(200).json(updatedOrder);
    } catch (err) { res.status(500).json(err) }
});

//DELETE

router.delete('/:id', authorizationAdmin, async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id)
        res.status(200).json("Order has been deleted...");
    } catch (err) { res.status(500).json(err) }
})

//GET USER Orders

router.get('/:userId', authorization, async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.params.userId })
        res.status(200).json(orders)
    } catch (err) { res.status(500).json(err) }
})

//GET ALL 
router.get('/', authorizationAdmin, async (req, res) => {
    try {
        const Orders = await Order.find();
        res.status(200).json(Orders)
    } catch (err) { res.status(500).json(err) }
})

// GET MONTHLY INCOME

router.get('/income', authorizationAdmin, async (req, res) => {
    const date = new Date(); // 7
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1)) // 6
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1)) // 5

    try {
        const income = await Order.aggregate([
            { $match: { createdAt: { $gte: previousMonth } } },
            {
                $project: {
                    month: { $month: "$createdAt" },
                    sales: "$amount",
                },
            },
            {
                $group: {
                    _id: "$month",
                    total: { $sum: "$sales" },
                },
            },
        ]);
        res.status(200).json(income)
    } catch (err) { res.status(500).json(err) }
})


module.exports = router