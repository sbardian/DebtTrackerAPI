import logger from 'console';

const User = require('../models/User');
const CreditCard = require('../models/CreditCard');

export const getAllCreditCards = (req, res, next) => {
  // TODO: Update to use query to sort (ex: 'sort=balance', 'sort=interest_rate'.
  User.findById(req.session.userId).exec((error, user) => {
    if (error) {
      return next(error);
    }
    if (user === null) {
      return res.redirect('/login');
    }
    let response = {};
    CreditCard.find({ userId: req.session.userId }, (err, data) => {
      if (err) {
        response = { error: true, message: 'Error fetching data' };
      } else {
        response = { error: false, message: data };
      }
      res.json(response);
    }).sort([['balance', 'descending']]);
  });
};

export const getCreditCardById = (req, res) => {
  logger.info('request = ', req.params);
  let response = {};
  CreditCard.findById(req.params.id, (err, data) => {
    if (err) {
      response = { error: true, message: 'Error fetching data' };
    } else {
      response = { error: false, message: data };
    }
    res.json(response);
  });
};

export const addCreditCard = (req, res) => {
  let response = {};
  const creditCard = new CreditCard();
  creditCard.userId = req.session.userId;
  creditCard.user = req.body.user;
  creditCard.name = req.body.name;
  creditCard.limit = req.body.limit;
  creditCard.balance = req.body.balance;
  creditCard.interest_rate = req.body.interest_rate;
  if (
    !(
      creditCard.userId &&
      creditCard.user &&
      creditCard.name &&
      creditCard.limit &&
      creditCard.balance &&
      creditCard.interest_rate
    )
  ) {
    return res.json({ error: true, message: 'One more more fields missing' });
  }
  creditCard.save(err => {
    if (err) {
      response = { error: true, message: 'Error adding data' };
    } else {
      response = {
        error: false,
        message: 'Data added',
        _id: creditCard.id,
        updated_at: creditCard.updated_at,
        __v: creditCard.v,
      };
    }
    res.json(response);
  });
};

export const deleteCreditCard = (req, res) => {
  let response = {};
  CreditCard.findById(req.params.id, err => {
    if (err) {
      return res.json({ error: true, message: 'Error fetching data' });
    }
    CreditCard.remove({ _id: req.params.id }, () => {
      if (err) {
        response = { error: true, message: 'Error deleting data' };
      } else {
        response = {
          error: false,
          message: `Data associated with ${req.params.id} is deleted`,
        };
      }
      res.json(response);
    });
  });
};

export const putOrUpdate = (req, res) => {
  let response = {};
  CreditCard.findById(req.params.id, (err, initialData) => {
    const data = initialData;
    data.userId = req.session.userId;
    if (err) {
      response = { error: true, message: 'Error fetching data' };
    } else {
      if (req.body.name !== undefined) {
        data.name = req.body.name;
      }
      if (req.body.limit !== undefined) {
        data.limit = req.body.limit;
      }
      if (req.body.balance !== undefined) {
        data.balance = req.body.balance;
      }
      if (req.body.interest_rate !== undefined) {
        data.interest_rate = req.body.interest_rate;
      }
      data.save(() => {
        if (err) {
          response = { error: true, message: 'Error updating data' };
        } else {
          response = {
            error: false,
            message: `Data is updated for ${req.body.name}`,
          };
        }
        res.json(response);
      });
    }
  });
};
