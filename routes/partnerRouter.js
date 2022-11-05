// DEFINE VARIABLES //
const express = require('express');
const partnerRouter = express.Router();

// CREATE partnerRouter ROUTER //
partnerRouter.route('/')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req, res) => {
    res.end('Will send all the partner to you.');
})
.post((req, res) => {
    res.end(`Will add the partner: ${req.body.name} with description: ${req.body.description}`);
})
.put((req, res) => {
    res.statusCode = 403;
    res.end('PUT request is not supported on /partner');
})
.delete((req, res) => {
    res.end('Deleting all partner');
});

partnerRouter.route('/:partnerId')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader = ('Content-Type', 'text/plain');
    next();
})
.get((req, res) => {
    res.end(`Will send details of the partner: ${req.params.partnerId}`);
})
.post((req, res) => {
    res.statusCode = 403;
    res.end(`POST operation is not supported on partner/:partnerId`);
})
.put((req, res) => {
    res.end(`Updating partner ${req.body.name} with ${req.body.description}`)
})
.delete((req, res) => {
    res.end(`Deleting partner with ID of ${req.params.partnerId}`)
});

// EXPORT STATEMENT //
module.exports = partnerRouter; 