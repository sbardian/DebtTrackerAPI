import { config } from '../yargs';

const jwt = require('jsonwebtoken');

export const checkAuth = (req, res, next) => {
  if (req.session && req.session.token) {
    jwt.verify(req.session.token, config.sessionSecret, () => {
      if (req.session && req.session.userId) {
        return next();
      }
      return res.status(401).end();
    });
  } else {
    return res.status(401).end();
  }
};
