var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var http = require('http');
var socketio = require('socket.io');
var app = express();

var tvRouter = require('./routes/tv');
var detailRouter = require('./routes/detail');

// Set up server. This used to live in www.
var server = http.createServer(app);

// Set up socket.io websocket.
var io = socketio(server);

io.on('connection', (socket) => {
  console.log('Client WS connection established!');
});

// Send data to all connected websocket clients in a loop.
var updateClients = require('./websockets/update')
setInterval(function() { updateClients(io) }, 3000);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', tvRouter);
app.use('/detail', detailRouter);

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

module.exports = { app: app, server: server };
