// DEFINE VARIABLES //
const express = require('express');
const favoriteRouter = express.Router();
const Favorite = require('../models/favorites');
const authenticate = require('../authenticate');
const cors = require('./cors');

favoriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorite.find({ user: req.user._id })
    .populate('user')
    .populate('campsites')
    .then(favorite => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorite);
    })
    .catch(err => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._id })
    .then(favorite => {
        if (favorite) {
            req.body.forEach(fav => {
                if (!favorite.campsites.includes(fav._id)) {
                    favorite.campsites.push(fav._id);
                }
            });
            favorite.save()
            .then(favorite => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            })
            .catch(err => next(err));
            } else {
                Favorite.create({ user: req.user._id })
                .then(favorite => {
                    req.body.forEach(fav => {
                        if (!favorite.campsites.includes(fav._id)) {
                            favorite.campsites.push(fav._id);
                        }
                    });
                    favorite.save()
                    .then(favorite => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(favorite);
                    })
                    .catch(err => next(err));
                })
                .catch(err => next(err));
            }
        }).catch(err => next(err));
    })
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOneAndDelete({ user: req.user._id })
    .then(favorite => { 
        if(favorite) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json')
            res.json(favorite);
        } else {
            res.statusCode = 200;
            res.end('You do not have any favorites to delete.');
        }
    })
    .catch(err => next(err));
})

favoriteRouter.route('/:campsiteId')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({user: req.user._id})
    .then(favorite => {
        if(favorite){
            if(!favorite.campsites.includes(req.params.campsiteId)) {
                favorite.campsites.push(req.params.campsiteId);
                favorite.save()
                .then(favorite => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);
                })
                .catch(err => next(err));
            } else {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/plain');
                res.end('That campsite is already a favorite!');
            }
        } else {
            Favorite.create({ user: req.user._id, campsites: [req.campsiteId] })
            .then(favorite => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);        
            })
            .catch(err => next(err))
        }
    })
    .catch(err => next(err))
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({user: req.user._id })
    .then(favorite => {
        if (favorite) {
            console.log('Favorite exists!')
            const index = favorite.campsites.indexOf(req.params.campsiteId);
            if (index >= 0) {
                console.log('Favorite found at index: ', index);
                favorite.campsites.splice(index, 1);
                favorite.save()
                .then(favorite => {
                    console.log('Favorite Campsite Deleted!', favorite);
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);
                }).catch(err => next(err));
            } else {
                console.log('Favorite is not found');
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/html');
                res.end(`That campsite is not listed as a favorite.`);        
            }
            
        } else {
            console.log(favorite);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html');
            res.end(`You don't have any favorite campsites to delete.`);
        }
    })

    .catch(err => next(err))
});

module.exports = favoriteRouter;