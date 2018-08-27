var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var config = require('./config');

var ebridge = require('./routes/ebridge');
// var weapp = require('./routes/weapp');

var app = express();
var server = require('http').Server(app);

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
global.__root = __dirname;
// app.use(express.static(path.join(__dirname, 'public/build')));

//To prevent errors from Cross Origin Resource Sharing, we will set our headers to allow CORS with middleware like so:
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');

  //and remove cacheing so we get the most recent comments
  res.setHeader('Cache-Control', 'no-cache');
  next();
});

mongoose.connect(config.mongoURL, (err) => {
  if (err) throw err;
});

var io = require('socket.io')(server);
app.set('socketio', io);

app.use('/ebridge', ebridge);
// app.use('/weapp', weapp);
app.use(express.static(path.join(__dirname, 'public/build')));
// Always return the main index.html, so react-router render the route in the client
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/build/index.html'));
});

module.exports = { app, server };