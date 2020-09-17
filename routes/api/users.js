const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const key = require('../../config/keys').secret;
const User = require('../../model/User');

//***************************************/
//*** Registrate: api/users/register ***/
//*************************************/
router.post('/register', async (req, res) => {
  let { name, username, email, password, confirm_password } = req.body;
  if (password !== confirm_password) {
    return res.status(400).json({
      msg: 'Password does not match the given one.',
    });
  }
  // Check for unique username
  await User.findOne({ username: username }).then((user) => {
    if (user && !res.headersSent) {
      return res
        .status(400)
        .json({
          msg: 'Username is already taken.',
        })
        .end();
    }
  });
  // Check for unique Email.
  await User.findOne({ email: email }).then((user) => {
    if (user && !res.headersSent) {
      return res
        .status(400)
        .json({
          msg: 'Email is already registred.',
        })
        .end();
    }
  });
  // The data is valid and a new user can be registered.
  if (!res.headersSent) {
    let newUser = User({
      name,
      username,
      password,
      email,
    });
    //Hash password.
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err;
        newUser.password = hash;
        newUser.save().then((user) => {
          return res
            .status(201)
            .json({
              success: true,
              msg: 'User is now registered.',
            })
            .end();
        });
      });
    });
  }
});

//*******************************/
//*** Login: api/users/login ***/
//*****************************/
router.post('/login', (req, res) => {
  User.findOne({
    username: req.body.username,
  }).then((user) => {
    if (!user) {
      return res.status(404).json({
        msg: 'Username is not found.',
        success: false,
      });
    }
    bcrypt.compare(req.body.password, user.password).then((isMatch) => {
      if (isMatch) {
        // user password is correct adn need to send json token for that user
        const payload = {
          _id: user._id,
          username: user.username,
          name: user.name,
          email: user.email,
        };
        jwt.sign(payload, key, { expiresIn: 60480 }, (err, token) => {
          res.status(200).json({
            success: true,
            token: `Bearer ${token}`,
            msg: 'You are now logged in.',
          });
        });
      } else {
        return res
          .status(404)
          .json({ msg: 'incorrect password', success: false });
      }
    });
  });
});

/* 
@route POST api/users/profile
@desc Return the users Data
@acces Public
*/
router.get(
  '/profile',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    return res.json({
      user: req.user,
    });
  }
);
module.exports = router;
