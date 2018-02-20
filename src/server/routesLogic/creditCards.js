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

export const getCreditCardByID = (req, res) => {
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

/*
 * wtf. .  above works but not below.
 *
export const getCreditCardById = (req, res) => {
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
*/

export const addCreditCard = (req, res) => {
  const db = new CreditCard();
  let response = {};
  db.userId = req.session.userId;
  db.user = req.body.user;
  db.name = req.body.name;
  db.limit = req.body.limit;
  db.balance = req.body.balance;
  db.interest_rate = req.body.interest_rate;
  db.save(err => {
    if (err) {
      response = { error: true, message: 'Error adding data' };
    } else {
      response = {
        error: false,
        message: 'Data added',
        _id: db.id,
        updated_at: db.updated_at,
        __v: db.v,
      };
    }
    res.json(response);
  });
};

export const deleteCreditCard = (req, res) => {
  let response = {};
  CreditCard.findById(req.params.id, err => {
    if (err) {
      response = { error: true, message: 'Error fetching data' };
    } else {
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
    }
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
