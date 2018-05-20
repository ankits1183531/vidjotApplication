const express = require('express');
var exphbs = require('express-handlebars');
var mongoose = require('mongoose');
var methodOverride = require('method-override');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const path = require('path');
const passport = require('passport');

const app = express();

//Load Routes

const ideas = require('./routes/ideas');
const users = require('./routes/users');

// passport config

require('./config/passport')(passport);

//DB confg file
db = require('./config/database');

//Connect to MOngoose
mongoose.connect(db.mongoURI)
  .then(() => {
    console.log('Mongo DB Connected....');
  })
  .catch(err => {
    console.log(err);
  });

// Handlebars middleware 
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Bodyparser middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//Static folder
app.use(express.static(path.join(__dirname, 'public')));


// Method Override Middleware
app.use(methodOverride('_method'));

// express session middleware
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
}))


//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// flash middleware
app.use(flash());

// Global Variable
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
})

//Index Route 
app.get('/', (req, res) => {
  title = "Lets";
  res.render('index', {
    title: title
  });
});


// About Route
app.get('/about', (req, res) => {
  res.render('about');
})


//Use Routes

app.use('/ideas', ideas);
app.use('/users', users);


const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server Satarted on port ${port}`);
});

