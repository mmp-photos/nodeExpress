// DEFINE VARIABLES //
const express = require('express');
const campsitesRouter = express.Router();

// CREATE campsitesRouter ROUTER //
campsitesRouter.route('/')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req, res) => {
    res.end('Will send all the campsites to you.');
})
.post((req, res) => {
    res.end(`Will add the campsite: ${req.body.name} with description: ${req.body.description}`);
})
.put((req, res) => {
    res.statusCode = 403;
    res.end('PUT request is not supported on /campsites');
})
.delete((req, res) => {
    res.end('Deleting all campsites');
});

campsitesRouter.route('/:campsiteId')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader = ('Content-Type', 'text/plain');
    next();
})
.get((req, res) => {
    res.end(`Will send details of the campsite: ${req.params.campsiteId}`);
})
.post((req, res) => {
    res.statusCode = 403;
    res.end(`POST operation is not supported on campsites/:campsiteId`);
})
.put((req, res) => {
    res.end(`Updating campsite ${req.body.name} with ${req.body.description}`)
})
.delete((req, res) => {
    res.end(`Deleting campsite with ID of ${req.params.campsiteId}`)
});

// EXPORT STATEMENT //
module.exports = campsitesRouter; 