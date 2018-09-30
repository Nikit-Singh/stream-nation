const express = require('express');
const mongoose = require('mongoose');
const { ensureAuthenticated } = require('../helpers/auth');

const router = express.Router();


// Load Video Model
require('../models/Video');
const Video = mongoose.model('videos');


// Add Video Form
router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('videos/add');
});


// Adding Video
router.post('/', ensureAuthenticated, (req, res) => {

    const newUser = {
        video: req.body.video,
        link: req.body.link
    };

    new Video(newUser).save()
        .then(Video => {
            req.flash('success_msg', 'Video Added');
            res.redirect('/videos/playlist');
        });
});



// Course Index Page
router.get('/playlist', ensureAuthenticated, (req, res) => {
    Video.find({})
        .then(videos => {
            res.render('videos/playlist', {
                videos: videos
            });
        });
});


// Accessing Video
router.get('/playlist/mainvideo', ensureAuthenticated, (req, res) => {
    res.render('videos/mainvideo', {
        video: req.query.video,
        link: req.query.link
    });
});


// // Accessing Videos Though Index
// router.post('/playlist/mainvideo', (req, res) => {

//     console.log('Poop');

//     const newUser = {
//         link: req.body.link
//     };

//     new Video(newUser).save()
//         .then(Video => {
//             req.flash('success_msg', 'Video');
//             res.redirect('/videos/playlist/mainvideo');
//         })
//         .catch(err => {
//             console.log(err);
//         });
// });


module.exports = router;