var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var expressSession = require('express-session');
var flash = require('connect-flash');
var connectMongo = require('connect-mongo');


var config = require('./config');
var routes = require('./routes/index');
var users = require('./routes/users');
var pleyRebu = require('./routes/pley-rebu');
var favorites = require('./routes/favorites');
var yelp = require('./routes/yelp');
var distance = require('./routes/distance');
var uber = require('./routes/uber');
//connectMongo will return a function, which will be treated as a class, where it will need to be
//instantiated with the 'new' keyword
var MongoStore = connectMongo(expressSession);

var passportConfig = require('./auth/passport-config');
passportConfig();

mongoose.connect(config.mongoUri);
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(flash());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(expressSession({
  secret: 'very secret',
  saveUninitialized: false,
  resave: false,
  store: new MongoStore({
    mongooseConnection: mongoose.connection
  })
}));


app.use(passport.initialize());
//requires express-session
app.use(passport.session());

app.use('/', routes);
app.use('/users', users);
app.use('/pley-rebu', pleyRebu);
app.use('/favorites', favorites);
app.use('/yelp', yelp);
app.use('/distance', distance);
app.use('/uber', uber);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
