const express = require('express');
const sports = require('../routes/sports');
const betTypes = require('../routes/betTypes');
const tipsters = require('../routes/tipsters');
const bookmakers = require('../routes/bookmakers');
const winTypes = require('../routes/winTypes');
const bets = require('../routes/bets');
const users = require('../routes/users');
const auth = require('../routes/auth');
const error = require('../middleware/error');

module.exports = function (app) {
  app.use(express.json());
  app.use('/api/sports', sports);
  app.use('/api/betTypes', betTypes);
  app.use('/api/tipsters', tipsters);
  app.use('/api/bookmakers', bookmakers);
  app.use('/api/winTypes', winTypes);
  app.use('/api/bets', bets);
  app.use('/api/users', users);
  app.use('/api/auth', auth);
  app.use(error);
}