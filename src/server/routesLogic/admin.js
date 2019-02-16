const User = require('../models/User');
const CreditCards = require('../models/CreditCard');
const Total = require('../models/Total');

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

export const deleteUser = (req, res) => {
  const { id } = req.params;
  User.findById(id, (err, data) => {
    if (err) {
      return res.status(400).send({
        error: true,
        message: `Error finding user: ${data.username}`,
      });
    }
    CreditCards.deleteMany({ userId: id }, creditCardError => {
      if (creditCardError) {
        return res.status(400).send({
          error: true,
          message: creditCardError.message,
        });
      }
      Total.deleteMany({ userId: id }, totalError => {
        if (totalError) {
          return res.status(400).send({
            error: true,
            message: totalError.message,
          });
        }
        User.deleteOne({ _id: id }, userError => {
          if (userError) {
            return res.status(400).send({
              error: true,
              message: userError.message,
            });
          }
          return res.status(200).send({
            error: false,
            message: `User '${data.username}' and all their data deleted`,
          });
        });
      });
    });
  });
};
