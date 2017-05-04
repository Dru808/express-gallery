/*jshint esversion: 6*/

// required modules
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const handlebars = require('express-handlebars');
const methodOverride = require('method-override');


// passport
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

//session
const session = require('express-session');
const RedisStore = require('connect-redis')(session);

//password hashing
const saltRounds = 10;
const bcrypt = require('bcrypt');

// sequelize
const db = require('./models');
const { User } = require('bcrypt');

const galleryRouter = require('./routes/photos.js');

// server set-up
const PORT = process.env.PORT || 1998;
const app = express();

// handlebars engine
const hbs = handlebars.create({
  extname: '.hbs',
  defaultLayout: 'main'
});
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

// instantiate body-parser middle-ware
app.use(bodyParser.urlencoded({extended: false}));

// instantiate method-overide middle-ware
app.use(methodOverride('_method'));

// setup sessions
app.use(session({
  store: new RedisStore(),
  secret: 'secret',
  resave: false,
  saveUninitialized: true
}));

// set passport
app.use(passport.initialize());
app.use(passport.session());

// passport local Strategy
passport.use(new LocalStrategy (
    (username, password, done) => {
    console.log('runs before serializing');
    User.findOne({
      where: {
        username: username
      }
    })
    .then ( user => {
      if (user === null) {
        console.log('user failed');
        return done(null, false, {message: 'bad username'});
      }
      else {
        bcrypt.compare(password, user.password)
        .then(res => {
          if (res) { return done(null, user); }
          else {
            return done(null, false, {message: 'bad password'});
          }
        });
      }
    })
    .catch(err => {
      console.log('error: ', err);
    });
  }
));

passport.serializeUser(function(user, done) {
  console.log('serializing');
// ^ ---------- given from authentication strategy
  // building the object to serialize to save
  return done(null, {
    id: user.id,
    username: user.username
  });
});

passport.deserializeUser(function(user, done) {
  console.log('deserializing');
  // ^ ---------- given from serializeUser
  User.findOne({
    where: {
      id: user.id
    }
  }).then(user => {
    return done(null, user); // <------- inserts into the request object
  });
});


// ROUTING

app.use(express.static('public'));

// default route
app.get('/', (req, res) => {
  console.log(req);//put in index to show all photos later
  res.send("hello");
  //res.redirect('/gallery');;
});

// login section
app.get('/login', (req, res) => {
  //res.send('login success');
  res.render('login');
});

app.post('/login', passport.authenticate('local', {
  successRedirect: '/secret',
  failureRedirect: '/login'
}));

//new user section
app.post('/user/new', (req, res) => {
  console.log(req.body);
  bcrypt.genSalt(saltRounds, function(err, salt){
    bcrypt.hash(req.body.password, salt, function(err, hash) {
      User.create({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        username: req.body.username,
        password: hash
      })
      .then((user) => {
        console.log(user);
        res.redirect('/login');
      });
    });
  });
});

// secure routes
// secure helper function
function isAuthenticated (req, res, next) {
  console.log('checking');
  if(req.isAuthenticated()) {
    console.log('you good');
    next();
  }else {
    console.log('you bad!!!!');
    res.redirect('/login');
  }
}

//"/secret" route
app.get('/secret', isAuthenticated, (req, res) => {
  console.log('req.user: ', req.user);
  console.log('req.user id', req.user.id);
  console.log('req.username', req.user.username);
  console.log('req.user.password: ', req.user.password);

  console.log('pinging the secret');
  res.send('you found the secret!');
});

// "/gallery" route handler
app.use('/gallery', galleryRouter);

// 404 route
app.get('*', (req, res) => {
  res.render('404');
});

// create server
app.listen(PORT, () => {
  db.sequelize.sync();
});

