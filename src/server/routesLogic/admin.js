import User from '../models/User';
import CreditCard from '../models/CreditCard';
import Total from '../models/Total';

// TODO: Implement sorting from query params
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

export const getUserCreditCards = (req, res) => {
  const { field, sort } = req.query;
  CreditCard.find({ userId: req.params.id }, (error, data) => {
    if (error) {
      return res
        .status(400)
        .json({ error: true, message: 'Error fetching data' });
    }
    return res.json({
      error: false,
      creditCards: data,
      isAdmin: req.session.isAdmin,
    });
  }).sort({ [field]: sort });
};

export const deleteUser = (req, res) => {
  User.findById(req.params.id, (err, data) => {
    if (err) {
      return res.status(400).send({
        error: true,
        message: `Error finding user: ${data.username}`,
      });
    }
    CreditCard.deleteMany({ userId: req.params.id }, creditCardError => {
      if (creditCardError) {
        return res.status(400).send({
          error: true,
          message: creditCardError.message,
        });
      }
      Total.deleteMany({ userId: req.params.id }, totalError => {
        if (totalError) {
          return res.status(400).send({
            error: true,
            message: totalError.message,
          });
        }
        User.deleteOne({ _id: req.params.id }, userError => {
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

export const updateUser = (req, res) => {
  const { username, email, password } = req.body;
  if (password) {
    User.findOne({ email }).exec(async (err, userData) => {
      User.updateOne(
        { _id: req.params.id },
        { username, email, password, isAdmin: userData.isAdmin },
        (error, data) => {
          if (error || data.ok !== 1) {
            return res.status(400).send({
              error: true,
              message: error.message,
            });
          }
          return res.status(200).send({
            error: false,
            message: `User has been updated`,
          });
        },
      );
    });
  } else {
    User.findOne({ email }).exec(async (err, userData) => {
      User.updateOne(
        { _id: req.params.id },
        { username, email, isAdmin: userData.isAdmin },
        (error, data) => {
          if (error || data.ok !== 1) {
            return res.status(400).send({
              error: true,
              message: error.message,
            });
          }
          return res.status(200).send({
            error: false,
            message: `User has been updated`,
          });
        },
      );
    });
  }
};

export const deleteUserCreditCard = (req, res) => {
  CreditCard.findById(req.params.id, (findError, data) => {
    if (findError) {
      res.status(400).send({
        error: true,
        message: findError.message,
      });
    }
    CreditCard.findOneAndDelete({ _id: req.params.id }, err => {
      if (err) {
        return res.status(400).send({
          error: true,
          message: err.message,
        });
      }
      return res.status(200).send({
        error: false,
        message: `Credit card '${data.name}' deleted`,
        creditCard: data,
      });
    });
  });
};

export const updateUserCreditCard = (req, res) => {
  const { name, limit, balance, interest_rate } = req.body;
  CreditCard.findByIdAndUpdate(
    req.params.id,
    { name, limit, balance, interest_rate },
    { upsert: false, new: true, runValidators: true },
    (err, data) => {
      if (err) {
        return res.status(400).send({
          error: true,
          message: err.message,
        });
      }
      return res.status(200).send({
        error: false,
        message: `Data updated for credit card '${data.name}'`,
        creditCard: data,
      });
    },
  );
};

export const getUsersTotals = (req, res) => {
  Total.find({ userId: req.params.id }, (error, data) => {
    if (error) {
      return res.status(400).send({
        error: true,
        message: error.message,
      });
    }
    return res.status(200).send({
      error: false,
      message: `Totals received for user id '${req.params.id}'`,
      totals: data,
    });
  });
};

export const deleteUsersTotals = (req, res) => {
  CreditCard.findById(req.params.id, (findError, data) => {
    if (findError) {
      res.status(400).send({
        error: true,
        message: findError.message,
      });
    }
    Total.findOneAndDelete({ _id: req.params.id }, error => {
      if (error) {
        return res.status(400).send({
          error: true,
          message: error.message,
        });
      }
      return res.status(200).send({
        error: false,
        message: `Total deleted`,
        total: data,
      });
    });
  });
};
