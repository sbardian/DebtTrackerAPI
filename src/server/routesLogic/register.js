import { config } from '../yargs';
import { log } from '../utils';

const User = require('../models/User');
const jwt = require('jsonwebtoken');

export const register = async (req, res, next) => {
  // confirm that user typed same password twice
  const { email, username, password, passwordConf } = req.body;
  const userData = {
    email,
    username,
    password,
    passwordConf,
    isAdmin: false,
  };
  if (password !== passwordConf) {
    const err = new Error('Passwords do not match.');
    err.status = 400;
    return next(err);
  }
  if (!(email && username && password && passwordConf)) {
    const err = new Error('All fields are required.');
    err.status = 400;
    return next(err);
  }
  try {
    await User.create(userData, (err, user) => {
      if (err) {
        log.error('Error creating user: ', err);
        return next(err);
      }
      req.session.userId = user._id;
      const payload = {
        isAdmin: false,
      };
      const token = jwt.sign(payload, config.sessionSecret, {
        expiresIn: 1440,
      });
      const data = {
        userId: req.session.userId,
        username: user.username,
        token,
      };
      res
        .set({
          location: '/',
        })
        .status(200)
        .send(data);
    });
  } catch (err) {
    return res.status(400).send(err.message);
  }
  return next();
};
