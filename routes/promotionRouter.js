// DEFINE VARIABLES //
const express = require('express');
const promotionRouter = express.Router();

// CREATE promotionRouter ROUTER //
promotionRouter.route('/')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req, res) => {
    res.end('Will send all the promotion to you.');
})
.post((req, res) => {
    res.end(`Will add the promotion: ${req.body.name} with description: ${req.body.description}`);
})
.put((req, res) => {
    res.statusCode = 403;
    res.end('PUT request is not supported on /promotion');
})
.delete((req, res) => {
    res.end('Deleting all promotion');
});

promotionRouter.route('/:promotionId')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader = ('Content-Type', 'text/plain');
    next();
})
.get((req, res) => {
    res.end(`Will send details of the promotion: ${req.params.promotionId}`);
})
.post((req, res) => {
    res.statusCode = 403;
    res.end(`POST operation is not supported on promotion/:promotionId`);
})
.put((req, res) => {
    res.end(`Updating promotion ${req.body.name} with ${req.body.description}`)
})
.delete((req, res) => {
    res.end(`Deleting promotion with ID of ${req.params.promotionId}`)
});

// EXPORT STATEMENT //
module.exports = promotionRouter; 