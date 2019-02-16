const User = require('../models/User');

export const getAllUsers = (req, res) => {
  User.find({}, (error, data) => {
    if (error) {
      return res
        .status(400)
        .json({ error: true, message: 'Error fetching data' });
    }
    return res.json({ error: false, users: data });
  })
    .select('-password')
    .sort({ username: 'asc' });
};
