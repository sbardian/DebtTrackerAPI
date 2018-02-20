import { config } from '../yargs';

const jwt = require('jsonwebtoken');

export const checkAuth = (req, res, next) => {
  jwt.verify(
    req.headers.authorization.split(' ')[1],
    config.sessionSecret,
    (err, decoded) => {
      console.log('decoded, ', decoded);
      if (req.session && req.session.userId) {
        console.log('session success');
        return next();
      }
      return res.status(401).end();
    },
  );
};
