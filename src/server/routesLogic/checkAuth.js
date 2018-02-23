import { config } from '../yargs';
import { log } from '../utils';

const jwt = require('jsonwebtoken');

export const checkAuth = (req, res, next) => {
  jwt.verify(
    req.headers.authorization.split(' ')[1],
    config.sessionSecret,
    (err, decoded) => {
      log.debug('decoded, ', decoded);
      if (req.session && req.session.userId) {
        log.info('session success');
        return next();
      }
      return res.status(401).end();
    },
  );
};
