import jwt from 'jsonwebtoken';
import { config } from '../yargs';
import User from '../models/User';

export const login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    const err = new Error('Invalid login');
    err.status = 401;
    return next(err);
  }
  User.authenticate(email, password, (error, user) => {
    if (error || !user) {
      const err = new Error('Invalid login');
      err.status = 401;
      return next(err);
    }
    req.session.userId = user._id;
    const payload = {
      isAdmin: user.isAdmin,
    };
    req.session.token = jwt.sign(payload, config['session-secret'], {
      expiresIn: 1440,
    });
    res.set({ location: '/' });
    return res.status(200).send({
      username: user.username,
    });
  });
};
