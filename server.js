const express = require('express');
const morgan = require('morgan');
const campsitesRouter = require('./routes/campsitesRouter')
const promotionRouter = require('./routes/promotionRouter')
const partnerRouter = require('./routes/partnerRouter')

const hostname = 'localhost';
const port = 3000;

const app = express();
app.use(morgan('dev'));
app.use(express.json());

app.use('/campsites', campsitesRouter);
app.use('/partner', partnerRouter);
app.use('/promotion', promotionRouter);

/*
app.get('/campsites/:campsiteId', (req, res) => {
    res.end(`Will send the details of the requested campsite: ${req.params.campsiteId} back to you`);
});

app.post('/campsites/:campsiteId', (req, res) => {
    res.statusCode = 403;
    res.end(`POST requests not supported on /campsites/${req.params.campsiteID}`);
});

app.put('/campsites/:campsiteId', (req, res) => {
    res.write(`Updating the campsite: ${req.params.campsiteId}\n`);
    res.end(`Will update the campsite ${req.body.name} with description ${req.body.description}`);
})

app.delete('/campsites/:campsiteId', (req, res) => {
    res.end(`Deleting all campsites`);
}); */

app.use((req, res) =>{
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.end('<html><body><h1>This is an Express Server</h1></body></html>');
});

app.listen(port, hostname, () => {
    console.log(`The server is running at: ${hostname}:${port}`)
});
