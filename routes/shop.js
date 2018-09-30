const express = require('express');
const mongoose = require('mongoose');
const { ensureAuthenticated } = require('../helpers/auth');

const router = express.Router();


// Load Item Model
require('../models/Item');
const Item = mongoose.model('items');


// Add Product Form
router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('shop/add');
});


// Adding Item
router.post('/', ensureAuthenticated, (req, res) => {

    const newUser = {
        name: req.body.name,
        link: req.body.link,
        price: req.body.price
    };

    new Item(newUser).save()
        .then(item => {
            req.flash('success_msg', 'Item Added');
            res.redirect('/shop');
        });
});


// Shop Index Page
router.get('/', ensureAuthenticated, (req, res) => {
    Item.find({})
        .then(items => {
            res.render('shop/items', {
                items: items
            });
        });
});

module.exports = router;