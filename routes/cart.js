'use strict';
const router = require('express').Router();
const Cart = require('../models/Cart');
const { verifyToken, authorization, authorizationAdmin } = require('./verifyToken')

//CREATE

router.post('/', authorization, async (req, res) => {
    const newCart = new Cart(req.body);
    try {
        const savedCart = await newCart.save();
        res.status(200).json(savedCart)
    } catch (err) {
        console.log('????????????????????')
        res.status(500).json(err);
    }
})

// edit
router.put('/:id', authorization, async (req, res) => {
    try {
        const updatedCart = await Cart.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, { new: true });
        res.status(200).json(updatedCart);
    } catch (err) { res.status(500).json(err) }
});

//DELETE

router.delete('/:id', authorization, async (req, res) => {
    try {
        await Cart.findByIdAndDelete(req.params.id)
        res.status(200).json("Cart has been deleted...");
    } catch (err) { res.status(500).json(err) }
})

//GET USER Cart

router.get('/:userId', authorization, async (req, res) => {
    try {
        const cart = await Cart.find({ userId: req.params.userId })
        res.status(200).json(cart)
    } catch (err) { res.status(500).json(err) }
})

//GET ALL 

router.get('/', authorizationAdmin, async (req, res) => {
    try {
        const carts = await Cart.find();
        res.status(200).json(carts)
    } catch (err) { res.status(500).json(err) }
})


module.exports = router