var express = require('express'),
    exphbs = require('express-handlebars'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    session = require('express-session'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    TwitterStrategy = require('passport-twitter'),
    GoogleStrategy = require('passport-google'),
    FacebookStrategy = require('passport-facebook');

var app = express();

/*******************************************************************************
* Passport configuration
*******************************************************************************/

/*******************************************************************************
* Express configuration
*******************************************************************************/

//HTTP request logger middleware for node.js
app.use(logger('combined'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//Lets you use HTTP verbs such as PUT or DELETE in places where the 
//client doesn't support it.
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(session({secret: 'supernova', saveUninitialized: true, resave: true}));
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

// Configure express to use handlebars templates
var hbs = exphbs.create({
    defaultLayout: 'main', //we will be creating this layout shortly
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

/*******************************************************************************
* Routes
*******************************************************************************/
// Renders home
app.get('/', function(req, res){
    res.render('home', {user: req.user});
});

// Renders signin
app.get('/signin', function(req, res){
    res.render('signin');
});

// Local sign-in strategy
app.post('/login', passport.authenticate('local-signin', { 
        successRedirect: '/',
        failureRedirect: '/signin'
    })
);

// Logout
app.get('/logout', function(req, res){
    var name = req.user.username;
    console.log("LOGGIN OUT " + req.user.username)
    req.logout();
    res.redirect('/');
    req.session.notice = "You have successfully been logged out " + name + "!";
});

/*******************************************************************************
* Port
*******************************************************************************/
var port = process.env.PORT || 5000;
app.listen(port);
console.log("listening on port: " + port);