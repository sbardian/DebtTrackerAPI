import { config } from '../yargs';

const jwt = require('jsonwebtoken');
const User = require('../models/User');

export const login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    const err = new Error('Both email and password are required to login');
    err.status = 401;
    return next(err);
  }
  User.authenticate(email, password, (error, user) => {
    if (error || !user) {
      const err = new Error('Bad email or password');
      err.status = 401;
      return next(err);
    }
    req.session.userId = user._id;
    const payload = {
      isAdmin: user.isAdmin,
    };
    const token = jwt.sign(payload, config.sessionSecret, {
      expiresIn: 1440,
    });
    req.session.token = token;
    const data = {
      username: user.username,
    };
    res.set({ location: '/' });
    return res.status(200).send(data);
  });
};
