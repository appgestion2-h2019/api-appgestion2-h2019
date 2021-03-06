var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');

// Express 4.0
var app = express();

//ajout jp
// app.use(bodyParser.json({ limit: '105mb' }));
// app.use(bodyParser.urlencoded({ extended: true, limit: '105mb' }));

var indexRouter = require('./routes/index');
var utilisateur = require('./routes/usagers');
var usersRouter = require('./routes/users');
var sallesRouter = require('./routes/salles');
var pictosRouter = require('./routes/pictos');
var jeuxRouter = require('./routes/jeux');

//Pour avoir accès à l'API à partir d'un autre domaine.
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/salles', sallesRouter);
app.use('/utilisateurs', utilisateur);

app.use('/pictos', pictosRouter);
app.use('/jeux', jeuxRouter);

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
