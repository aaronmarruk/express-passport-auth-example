/**
 * Dependancies
 */

var express = require('express'),
    fs = require('fs'),
    mongoose = require('mongoose'),
    exphbs = require('express-handlebars'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    flash = require('connect-flash'),
    methodOverride = require('method-override'),
    expressSession = require('express-session'),
    passport = require('passport'),
    app = express();

/**
 * Middleware
 */

//HTTP request logger middleware for node.js
app.use(logger('combined'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//Lets you use HTTP verbs such as PUT or DELETE in places where the 
//client doesn't support it.
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(expressSession({
    secret: 'supernova', 
    saveUninitialized: true, 
    resave: true
}));
app.use(passport.initialize());
app.use(passport.session());

// Session-persisted message middleware
app.use(function(req, res, next){
    var err = req.session.error,
        msg = req.session.notice,
        success = req.session.success;

    delete req.session.error;
    delete req.session.success;
    delete req.session.notice;

    if (err) res.locals.error = err;
    if (msg) res.locals.notice = msg;
    if (success) res.locals.success = success;

    next();
});

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
// Do we need this still?
app.use(expressSession({ 
    secret: 'mySecretKey',
    saveUninitialized: true,
    resave: true
}));

/**
 * Set view engine
 */

var hbs = exphbs.create({
    defaultLayout: 'main', //we will be creating this layout shortly
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

/**
 * Load models
 */

fs.readdirSync(__dirname + '/models').forEach(function (file) {
    if (~file.indexOf('.js')) {   
        require(__dirname + '/models/' + file);
    }
});

/**
 * Load core modules
 */

require('./config/passport/passport.js')(app, passport);
require('./config/routes.js')(app, passport);

/**
 * Start application
 */

var port = process.env.PORT || 5000;
app.listen(port);
console.log("listening on port: " + port);