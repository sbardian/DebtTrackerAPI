import { sessionSecret } from '../yargs';

const User = require('../models/User');
const jwt = require('jsonwebtoken');

export const register = (req, res, next) => {
  // confirm that user typed same password twice
  if (req.body.password !== req.body.passwordConf) {
    const err = new Error('Passwords do not match.');
    err.status = 400;
    res.send('passwords dont match');
    return next(err);
  }
  const { email, username, password, passwordConf } = req.body;
  if (email && username && password && passwordConf) {
    const userData = {
      email,
      username,
      password,
      passwordConf,
    };
    User.create(userData, (error, user) => {
      if (error) {
        console.log('error in create: ', error);
        return next(error);
      }
      req.session.userId = user._id;
      const payload = {
        admin: false,
      };
      const token = jwt.sign(payload, sessionSecret, {
        expiresIn: 1440,
      });
      const data = {
        userId: req.session.userId,
        username: user.username,
        token,
      };
      res.set({
        location: '/',
      });
      return res.status(200).send(data);
    });
  } else {
    const err = new Error('All fields required.');
    err.status = 400;
    return next(err);
  }
};
