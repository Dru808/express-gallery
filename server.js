/*jshint esversion: 6*/

// required modules
const express = require('express');
const bodyParser = require('body-parser');
const handlebars = require('express-handlebars');
const methodOverride = require('method-override');

// other file paths required
const db = require('./models');
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

app.use(express.static('public'));

// body-parser middle-ware
app.use(bodyParser.urlencoded({extended: false}));

app.use(methodOverride('_method'));
// default route
app.get('/', function (req, res) {
  console.log(req);//put in index to show all phots later
  res.send("test");
});

// "/gallery" route handler
app.use('/gallery', galleryRouter);

// create server
app.listen(PORT, () => {
  db.sequelize.sync();
});

