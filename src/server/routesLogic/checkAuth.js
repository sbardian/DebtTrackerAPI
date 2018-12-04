import { config } from '../yargs';

const jwt = require('jsonwebtoken');

export const checkAuth = (req, res, next) => {
  jwt.verify(
    req.headers.authorization.split(' ')[1],
    config.sessionSecret,
    () => {
      if (req.session && req.session.userId) {
        return next();
      }
      return res.status(401).end();
    },
  );
};
