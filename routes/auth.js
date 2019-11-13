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
  if (!user) return res.status(400).send('Incorrect user');

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send('Incorrect password.');

  const token = user.generateAuthToken();
  res.status(200).json({
    token: token,
    userName: user.userName,
    email: user.email,
    _id: user._id
  });
});

function validate(req) {
  const schema = Joi.object({
    userName: Joi.string().required(),
    password: Joi.string().required()
  });

  return schema.validate(req);
}

module.exports = router;
