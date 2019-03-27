import jwt from 'jsonwebtoken';
import { config } from '../yargs';

export const checkAdmin = (req, res, next) => {
  if (!req.session || !req.session.token) {
    return res.status(401).end();
  }
  jwt.verify(req.session.token, config.sessionSecret, (err, payload) => {
    if (req.session.userId && payload.isAdmin) {
      return next();
    }
    return res.status(401).end();
  });
};
