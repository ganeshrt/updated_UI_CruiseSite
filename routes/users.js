const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
// Load User model
const Dbase = require('../app');
var db = Dbase.db;
// Login Page
router.get('/login', (req, res) => res.render('login'));

// Register Page
router.get('/register', (req, res) => res.render('register'));

router.get('/about', (req, res) => res.render('AboutCruise'));
router.get('/contact', (req, res) => res.render('contact'));


router.get('/index', (req, res) => res.render('index'));
router.get('/final-report', (req, res) => res.render('Final_report'));

router.get('/dining', (req, res) => res.render('dining'));

router.get('/avail-cruise', (req, res) => res.render('AvailableCruise'));
router.get('/customer-details', (req, res) => res.render('custumerDetail'));
router.get('/Guest-Detail', (req, res) => res.render('GuestDetail'));

router.get('/avail-rooms', (req, res) => res.render('AvailableRooms'));

router.get('/book-cruise', (req, res) => res.render('bookCruise'));

// Register
router.post('/register', (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  if (!name || !email || !password || !password2) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      password,
      password2
    });
  }
  else {
    var schema   = {
                 "selector": {
                     "email": email
                  }
    }
    db.find(schema,function(err,result){
         if(err)
           throw err;
         else if((JSON.stringify(result.docs))!="[]"){
           console.log(result.docs);
         errors.push({ msg: 'Email already exists' });
         res.render('register', {
           errors,
           name,
           email,
           password,
           password2
         });
               console.log('no...');
       }
       else if((JSON.stringify(result.docs))=="[]"){
        //console.log(newUser.password);
        console.log(result.docs);

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(password, salt, (err, hash) => {
            if (err) throw err;
             var enc_pass = hash;
             var newUser = {
               "name": name,
               "password": enc_pass,
               "email": email
             };


             db.insert(newUser,function(err,result){
             if(err){
              throw err;
             }else{
                   console.log('successfully inserted...');
                   req.flash(
                     'success_msg',
                     'You are now registered and can log in'
                   );
                   res.redirect('/users/login');
                 }
             });
           });
          });
        // });
      }
    });
  }
});
module.exports = { db : db};
// Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/users/index',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});

module.exports = router;
