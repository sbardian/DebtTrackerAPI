import jwt from 'jsonwebtoken';
import User from '../models/User';
import { config } from '../yargs';

export const register = async (req, res) => {
  const { email, username, password, passwordConf } = req.body;
  const userData = {
    email,
    username,
    password,
    isAdmin: false,
  };
  if (password !== passwordConf) {
    return res
      .status(400)
      .json({ error: true, message: 'Passwords do not match.' });
  }
  if (!(email && username && password && passwordConf)) {
    return res
      .status(400)
      .json({ error: true, message: 'All fields are required.' });
  }
  await User.create(userData, (err, user) => {
    if (err) {
      if (
        err.message.indexOf('email') === -1 &&
        err.message.indexOf('dup key') === -1
      ) {
        return res.status(400).send({
          error: true,
          message: 'Something went wrong, please try again.',
        });
      }
      return res
        .status(400)
        .send({ error: true, message: 'That email is already in use.' });
    }
    req.session.userId = user._id;
    const payload = {
      isAdmin: userData.isAdmin,
    };
    const token = jwt.sign(payload, config.sessionSecret, {
      expiresIn: 1440,
    });
    req.session.token = token;
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
};
