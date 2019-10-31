const Joi = require('@hapi/joi');
const bcrypt = require('bcrypt');
const {
  User
} = require('../models/user');
const express = require('express');
const router = express.Router();

/**
 * * Log in
 */
router.post('/', async (req, res) => {
  const {
    error
  } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({
    userName: req.body.userName
  });
  if (!user) return res.status(400).send('Invalid user');

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send('Invalid password.');

  const token = user.generateAuthToken();
  res.send(token);
});

function validate(req) {
  const schema = Joi.object({
    userName: Joi.string().min(3).max(50).required(),
    password: Joi.string().min(8).max(255).required()
  });

  return schema.validate(req);
}

module.exports = router;