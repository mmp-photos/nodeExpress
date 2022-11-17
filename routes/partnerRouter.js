// DEFINE VARIABLES //
const express = require('express');
const partnerRouter = express.Router();
const Partner = require('../models/partner');
const authenticate = require('../authenticate');

// CREATE partnerRouter ROUTER //
partnerRouter.route('/')
.get((req, res, next) => {
    Partner.find()
    .then(partners =>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json')
        res.json(partners);
    })
    .catch(err => next(err))
})
.post(authenticate.verifyUser, (req, res, next) => {
    Partner.create(req.body)
    .then(partner => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json')
        res.json(partner);
    })
    .catch(err => next(err))
})
.put(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end('PUT request is not supported on /partner');
})
.delete(authenticate.verifyUser, (req, res, next) => {
    Partner.deleteMany()
    .then(partner => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json')
        res.json(partner);
    })
    .catch(err => next(err))
});

partnerRouter.route('/:partnerId')
.get((req, res, next) => {
    Partner.findById(req.params.partnerId)
    .then(partner => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json')
        res.json(partner);
    })
    .catch(err => next(err))
})
.post(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('POST requests are not allowed');
})
.put(authenticate.verifyUser, (req, res, next) => {
    Partner.findByIdAndUpdate(req.params.partnerId, {
        $set: req.body
    }, {
        new: true
    })
    .then(partner => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(partner);
    })
    .catch((err) => next(err));
})
.delete(authenticate.verifyUser, (req, res, next) => {
    Partner.findByIdAndDelete(req.params.partnerId)
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err))
});

// EXPORT STATEMENT //
module.exports = partnerRouter; 