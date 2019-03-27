import { config } from '../yargs';

const jwt = require('jsonwebtoken');

export const checkAuth = (req, res, next) => {
  if (req.session && req.session.token) {
    jwt.verify(req.session.token, config.sessionSecret, (err, v) => {
      if (req.session.userId) {
        req.session.isAdmin = v.isAdmin;
        return next();
      }
      return res.status(401).end();
    });
  } else {
    return res.status(401).end();
  }
};
