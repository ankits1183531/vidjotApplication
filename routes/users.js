const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passpost = require('passport');
const router = express.Router();

//Load User model

require('../models/User');
const User = mongoose.model('users');


/// User Login Route
router.get('/login', (req, res) => {
  res.render('users/login');
})


//// Login form post

router.post('/login', (req, res, next) => {
  passpost.authenticate('local', {
    successRedirect: '/ideas',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});


/// User Register Route
router.get('/register', (req, res) => {
  res.render('users/register');
})


//Register Form post

router.post('/register', (req, res) => {
  let errors = [];
  if (req.body.password != req.body.password2) {
    errors.push({ text: 'Passwords not match' });
  }
  if (req.body.password.length < 4) {
    errors.push({ text: 'Password min length is 4 chararcters' });
  }
  if (errors.length > 0) {
    res.render('users/register', {
      errors: errors,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      password2: req.body.password2
    })
  } else {

    User.findOne({ email: req.body.email })
      .then(user => {
        if (user) {
          req.flash('error_msg', 'Email already exist');
          res.redirect('/user/register')
        } else {
          const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
          });
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              newUser.password = hash;
              newUser.save()
                .then(user => {
                  req.flash('success_msg', 'Yu are now registered');
                  res.redirect('/users/login');
                })
                .catch(err => {
                  console.log(err);
                  return
                })
            });
          })
        }
      })
  }
});

// Logout User

router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logout');
  res.redirect('/users/login');
})

module.exports = router;