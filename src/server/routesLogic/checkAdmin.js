import { config } from '../yargs';

const jwt = require('jsonwebtoken');

export const checkAdmin = (req, res, next) => {
  if (req.session && req.session.token) {
    jwt.verify(req.session.token, config.sessionSecret, (err, payload) => {
      if (req.session.userId && payload.isAdmin) {
        return next();
      }
      return res.status(401).end();
    });
  } else {
    return res.status(401).end();
  }
};
