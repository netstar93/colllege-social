var createError = require('http-errors');
var express = require('express');
var path = require('path');
var http = require('http');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var reload = require('reload');
var expressSession = require('express-session');
var flash = require('connect-flash');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var studentRouter = require('./routes/student');
var MemoryStore = expressSession.MemoryStore;
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(flash());

// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressSession({
    name : 'app.sid',
    secret: 'keyboard cat',
    resave: true,
    store: new MemoryStore(),
    saveUninitialized: true
}));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.message = req.flash();
  next();
  //next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.use('/users', usersRouter);
app.use('/', studentRouter);

app.set('port', process.env.PORT || 8000);

var server = http.createServer(app)
reload(app);
server.listen(app.get('port'), function () {
  console.log('Running on port ' + app.get('port'));
})

global._log = function (data) {
  console.log(data);
}

module.exports = app;