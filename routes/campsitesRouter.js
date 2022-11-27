// DEFINE VARIABLES //
const express = require('express');
const campsitesRouter = express.Router();
const Campsite = require('../models/campsite');
const authenticate = require('../authenticate');
const cors = require('./cors');

// CREATE campsitesRouter ROUTER //
campsitesRouter.route('/')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, (req, res, next) => {
    Campsite.find()
    .populate('comments.author')
    .then(campsites => {
        res.statusCode = 200,
        res.setHeader('Content-Type', 'application/json'),
        res.json(campsites)
    })
    .catch(err => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Campsite.create(req.body)
    .then(campsite => {
        console.log('Campsite Created', campsite);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(campsite);
    })
    .catch((err) => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    res.statusCode = 403;
    res.end('PUT request is not supported on /campsites');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Campsite.deleteMany()
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response)
    })
    .catch((err) => next(err));
});

// CREATE ROUTER FOR SPECIFIC CAMPSITES BY ID//
campsitesRouter.route('/:campsiteId')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.corsWithOptions, (req, res, next) => {
    Campsite.findById(req.params.campsiteId)
    .populate('comments.author')
    .then((campsite) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(campsite);
    })
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end(`POST operation is not supported on campsites/:campsiteId`);
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Campsite.findByIdAndUpdate(req.params.campsiteId, {
        $set: req.body
    }, {
        new: true
    })
    .then(campsite => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(campsite);
    })
    .catch((err) => next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Campsite.findByIdAndDelete(req.params.campsiteId)
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch((err) => next(err));
});

// CREATE ROUTER FOR CAMPSITE COMMENTS //
campsitesRouter.route('/:campsiteId/comments')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, (req, res, next) => {
    Campsite.findById(req.params.campsiteId)
    .populate('comments.author')
    .then(campsite => {
        if(campsite){
            res.statusCode = 200,
            res.setHeader('Content-Type', 'application/json'),
            res.json(campsite.comments)
        } else {
            err = new Error('Campsite comments not found')
            err.status = 400;
            return next(err);
        }
    })
    .catch(err => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Campsite.findById(req.params.campsiteId)
    .then(campsite => {
        if(campsite){
            req.body.author = req.user._id;
            campsite.comments.push(req.body);
            campsite.save()
            .then(campsite => {
                res.statusCode = 200,
                res.setHeader('Content-Type', 'application/json'),
                res.json(campsite.comments)
            })
        } else{
            err = new Error('Campsite comments not found')
            err.status = 400;
            return next(err);
        }
    })
    .catch((err) => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    res.statusCode = 403;
    res.end(`PUT request is not supported on /campsites/${campsiteId}/comments`);
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Campsite.findById(req.params.campsiteId)
    .then(campsite => {
        if(campsite){
            for (let i = (campsite.comments.length -1); i >= 0; i--) {
                campsite.comments.id(campsite.comments[i]._id).remove();
            }
            campsite.save()
            .then(campsite => {
                res.statusCode = 200,
                res.setHeader('Content-Type', 'application/json'),
                res.json(campsite.comments)
            })
        } else{
            err = new Error('Campsite comments not found')
            err.status = 400;
            return next(err);
        }
    })
    .catch((err) => next(err));
});

// CREATE ROUTER FOR CAMPSITE COMMENTS BY ID //
campsitesRouter.route('/:campsiteId/comments/:commentId')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, (req, res, next) => {
    Campsite.findById(req.params.campsiteId)
    .populate('comments.author')
    .then(campsite => {
        if(campsite && campsite.comments.id(req.params.commentId)){
            if(campsite.comments.id(req.params.commentId.author._id).equals(req.user._id)){
                res.statusCode = 200,
                res.setHeader('Content-Type', 'application/json'),
                res.json(campsite.comments.id(req.params.commentId))
            } else if (!campsite){
                err = new Error(`Campsite ${req.params.campsiteID} not found`)
                err.status = 400;
                return next(err);
            } else {
                err = new Error(`Comment ${req.params.commentId} comments not found`)
                err.status = 400;
                return next(err);
            }
        } else {
            err = new Error(`Only the original author may edit this comment.`);
            return next(err);
        }
    })
    .catch(err => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    res.statusCode = 403;
    res.end(`PUT request is not supported on /campsites/${campsiteId}/comments/${req.params.commentId}`);
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Campsite.findById(req.params.campsiteId)
    .then(campsite => {
        if(campsite && campsite.comments.id(req.params.commentId)){
            if(req.body.rating){
                campsite.comments.id(req.params.commentId).rating = req.body.rating;
            }
            if(req.body.text){
                campsite.comments.id(req.params.commentId).text = req.body.text;
            }
            campsite.save()
            .then(campsite => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(campsite);
            })
            .catch(err => next(err));
        } else if (!campsite){
            err = new Error(`Campsite ${req.params.campsiteID} not found`)
            err.status = 400;
            return next(err);
        } else {
            err = new Error(`Comment ${req.params.commentId} comments not found`)
            err.status = 400;
            return next(err);
        }
    })
    .catch(err => next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Campsite.findById(req.params.campsiteId)
    .then(campsite => {
        if(campsite && campsite.comments.id(req.params.commentId)){
            if(campsite.comments.id(req.params.commentId.author._id).equals(req.user._id)){
                campsite.comment.id(req.params.commentId).remove();
                campsite.save()
                .then(campsite => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(campsite);
                })
                .catch(err => next(err));
            } else if (!campsite){
                err = new Error(`Campsite ${req.params.campsiteID} not found`)
                err.status = 400;
                return next(err);
            } else {
                err = new Error(`Comment ${req.params.commentId} comments not found`)
                err.status = 400;
                return next(err);
            }
        } else {
            err = new Error(`Only the original author may delete this comment.`);
            return next(err);
        }    
    })
    .catch((err) => next(err));
});

// EXPORT STATEMENT //
module.exports = campsitesRouter; 