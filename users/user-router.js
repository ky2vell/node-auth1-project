const express = require('express');
const bcrypt = require('bcryptjs');
const Users = require('./users-model');
const { userAuth } = require('../middleware/userAuth');

const router = express.Router();

// @desc    If logged in, all users. If logged out send message.
// @route   GET /api/users
router.get('/users', userAuth(), async (req, res, next) => {
  try {
    const users = await Users.getUsers();

    res.status(200).json({ count: users.length, data: users });
  } catch (err) {
    next(err);
  }
});

// @desc    Create user
// @route   POST /api/register
router.post('/register', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await Users.findUser({ username }).first();

    if (user) {
      return res.status(409).json({
        message: 'Username is already taken'
      });
    }

    const newUser = await Users.add({
      username,
      password: await bcrypt.hash(
        password,
        parseInt(process.env.TIME_COMPLEXITY)
      )
    });

    res.status(201).json(newUser);
  } catch (err) {
    next(err);
  }
});

// @desc    Login user
// @route   POST /api/login
router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await Users.findUser({ username }).first();

    if (!user) {
      return res.status(401).json({
        message: 'Invalid Credentials'
      });
    }

    const passwordValid = await bcrypt.compare(password, user.password);

    if (!passwordValid) {
      return res.status(401).json({
        message: 'Invalid Credentials'
      });
    }

    // create a new session for the user
    req.session.user = user;

    res.json({
      message: `Welcome ${user.username}!`
    });
  } catch (err) {
    next(err);
  }
});

// @desc    Logout user
// @route   POST /api/logout
router.get('/logout', userAuth(), async (req, res, next) => {
  try {
    req.session.destroy(err => {
      if (err) {
        next(err);
      } else {
        res.status(204).end();
      }
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
