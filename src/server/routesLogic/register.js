import { config } from '../yargs';

const jwt = require('jsonwebtoken');
const User = require('../models/User');

export const register = async (req, res) => {
  // confirm that user typed same password twice
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
      return res
        .status(400)
        .json({ error: true, message: `Error creating user: ${err}` });
    }
    req.session.userId = user._id;
    const payload = {
      isAdmin: false,
    };
    const token = jwt.sign(payload, config.sessionSecret, {
      expiresIn: 1440,
    });
    const data = {
      userId: req.session.userId,
      username: user.username,
      token,
    };
    res.set({
      location: '/',
    });
    return res.status(200).send(data);
  });
};
