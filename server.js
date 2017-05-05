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
const { User } = require('./models');


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

//  step-3 - passport local Strategy
passport.use(new LocalStrategy (
    (username, password, done) => {
    console.log('runs before serializing');
    User.findOne({
      where: {
        username: username
      }
    })
    .then ( user => {
      console.log('step-3; user: ', user);
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

//step-3a - passed here from passport
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

//  step-1 login section - pulls up login form
app.get('/login', (req, res) => {
  console.log('step-1');
  res.render('users/login');
});

//step-1a - if no user then pull this form to create user
app.get('/user/new', (req, res) => {
  console.log('creating user');
  res.render('users/newUser');
});

//step-2 - passes login info to passport for verification
app.post('/login', passport.authenticate('local', {
  successRedirect: '/gallery',
  failureRedirect: '/login'
}));

// step-2a new user section - this executes when pressed submit on login form
app.post('/user/new', (req, res) => {
  console.log('step-2');
  bcrypt.genSalt(saltRounds, function(err, salt){
    bcrypt.hash(req.body.password, salt, function(err, hash) {
      User.create({
        username: req.body.username,
        first_name: req.body.firstname,
        last_name: req.body.lastname,
        password: hash
      })
      .then((user) => {
        res.redirect('/login');
      });
    });
  });
});

// secure routes
// secure helper function
//step-4 getting hung up over here....


//"/secret" route
// app.get('/secret', isAuthenticated, (req, res) => {
//   console.log('req.user: ', req.user);
//   console.log('req.user id', req.user.id);
//   console.log('req.username', req.user.username);
//   console.log('req.user.password: ', req.user.password);

//   console.log('pinging the secret');
//   res.redirect('/gallery');

// });

// "/gallery" route handler
app.use('/gallery', galleryRouter);

// 404 route - renders error page when path not found
app.get('*', (req, res) => {
  res.render('404');
});

// create server
app.listen(PORT, () => {
  db.sequelize.sync();
});

