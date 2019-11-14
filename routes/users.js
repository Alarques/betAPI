const auth = require('../middleware/auth');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const {
  User,
  validate
} = require('../models/user');
const express = require('express');
const router = express.Router();

/**
 * * Obtiene la informacío del usuario conectado, menos el password
 */
router.get('/me', auth, async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.send(user);
});

/**
 * * Crea un usuario
 */
router.post('/', async (req, res) => {
  const {
    error
  } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({
    email: req.body.email
  });
  if (user) return res.status(400).send('Email already in use.');
  
  user = await User.findOne({
    userName: req.body.userName
  });
  if (user) return res.status(400).send('User already registered.');

  user = new User(_.pick(req.body, ['userName', 'email', 'password', 'totalBank']));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  const token = user.generateAuthToken();
  res.header('x-auth-token', token).send(_.pick(user, ['_id', 'userName', 'email']));
});

/**
 * * Busca un usuario por email
 */
router.get('/email/:email', auth, async (req, res) => {
  const user = await User.findOne({'email': req.params.email}).select('-password');

  if (!user || user.length === 0) return res.status(404).send('The user with the given email was not found.');

  res.send(user);
});

/**
 * * Busca un usuario por nombre
 */
router.get('/name/:name', auth, async (req, res) => {
  const user = await User.findOne({'userName': req.params.name}).select('-password');

  if (!user || user.length === 0) return res.status(404).send('The user with the given name was not found.');

  res.send(user);
});

module.exports = router;