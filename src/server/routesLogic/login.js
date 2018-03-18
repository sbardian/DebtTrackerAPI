import { config } from '../yargs';

const User = require('../models/User');
const jwt = require('jsonwebtoken');

export const login = (req, res, next) => {
  const { email, password } = req.body;
  if (email && password) {
    User.authenticate(email, password, (error, user) => {
      if (error || !user) {
        const err = new Error('Wrong email or password.');
        err.status = 401;
        return next(err);
      }
      req.session.userId = user._id;
      const payload = {
        isAdmin: false,
      };
      if (user.isAdmin) {
        payload.isAdmin = true;
      }
      const token = jwt.sign(payload, config.sessionSecret, {
        expiresIn: 1440,
      });
      const data = {
        userId: req.session.userId,
        username: user.username,
        isAdmin: payload.isAdmin,
        token,
      };
      res.set({
        location: '/',
      });
      return res.status(200).send(data);
    });
  } else {
    const err = new Error('Wrong email or password.');
    err.status = 401;
    return next(err);
  }
};
