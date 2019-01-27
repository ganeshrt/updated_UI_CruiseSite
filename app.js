const express = require('express');
// const expressLayouts = require('express-ejs-layouts');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
var Cloudant = require('@cloudant/cloudant');
var dotenvVar = require('dotenv').config();


const app = express();

// Passport Config
require('./config/passport')(passport);

// DB Config
var userName = process.env.user|| 'admin';
var password = process.env.password|| 'pass';
var dbName = process.env.dbname|| 'reg-users';

var cloudantUrl = `http://${userName}:${password}@192.168.99.100:5000`;
// Connect to Cloudant DB

var nano = Cloudant({
    url : cloudantUrl,
    plugins : 'promises'
},function(err , cloudant , reply){
   if(err) console.log('Db Connection Failed...');
   console.log('Db Connected : ',reply);
});

const db = nano.use(dbName);
module.exports = {
   db : db
};
// EJS
// app.use(expressLayouts);
app.set('view engine', 'ejs');
app.use('/assets',express.static(process.cwd()+'/assets'));


// Express body parser
app.use(express.urlencoded({ extended: true }));

// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// Routes
app.use('/', require('./routes/index.js'));
app.use('/users', require('./routes/users.js'));

const PORT = process.env.PORT || 3000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));
