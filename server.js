var express = require('express');
var cors = require('cors');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var login = require('./routes/login');
var youtube = require('./routes/youtube');
var postLogin = require('./routes/postLogin');
var getVideos = require('./routes/getVideos');
var updateTopic = require('./routes/updateTopic');
var addLotteryRequest = require('./routes/addLotteryRequest');
var test = require('./routes/test');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//start databse schemas
require('./data/User')();
require('./data/Topic')();
require('./data/Scoreboard')();
require('./data/Lottery_Request')();

app.use('/', routes);
app.use('/login', login);
app.use('/youtube', youtube);
app.use('/postLogin', postLogin);
app.use('/getVideos', getVideos);
app.use('/updateTopic', updateTopic);
app.use('/addLotteryRequest', addLotteryRequest);
app.use('/test', test);

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

var mongoose = require('mongoose');
global.connection = mongoose.createConnection('mongodb://apiadmin:cloudspire3@ds053469.mongolab.com:53469/speakfreely');
global.max_topic_responder = 5;


module.exports = app;
