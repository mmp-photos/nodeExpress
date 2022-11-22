var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
const passport = require('passport');
const config = require('./config');

var indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const campsitesRouter = require('./routes/campsitesRouter')
const promotionRouter = require('./routes/promotionRouter')
const partnerRouter = require('./routes/partnerRouter')

const mongoose = require('mongoose');

const url = config.mongoUrl;
const connect = mongoose.connect(url, {
  useCreateIndex: true,
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true
});

connect.then(() => console.log('Connected to the server'),
  err => console.log(err)
);
var app = express();

// Secure traffic only

app.all('*', (req, res, next) => {
  if (req.secure) {
    return next();
  } else {
      console.log(`Redirecting to: https://${req.hostname}:${app.get('secPort')}${req.url}`);
      res.redirect(301, `https://${req.hostname}:${app.get('secPort')}${req.url}`);
  }
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// SET UP SESSION //
/*  COMMENTING OUT TO REFER TO THE CODE LATER
app.use(session({
  name: 'session-id',
  secret: '12345-67890-09876-54321',
  saveUninitialized: false,
  resave: false,
  store: new FileStore()
}));
*/

app.use(passport.initialize());
//app.use(passport.session());

// ROUTES FOR ENDPOINTS THAT DON'T REQUIRE AUTHENTICATION //
app.use('/', indexRouter);
app.use('/users', usersRouter);

// CHECK FOR AUTHENTICATION //
/* COMMENTING OUT - WILL REFER TO IT LATER
function auth(req, res, next) {
  console.log(req.user);

  if(!req.user) {
      const err = new Error('You are not authenticated');
      err.status = 401;
      return next(err);
    } else {
        return next();
    }
};

app.use(auth);
*/

// BEGIN APP SPECIFIC ROUTES THAT REQUIRE AUTHENTICATION //
app.use(express.static(path.join(__dirname, 'public')));

app.use('/campsites', campsitesRouter);
app.use('/partner', partnerRouter);
app.use('/promotion', promotionRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
