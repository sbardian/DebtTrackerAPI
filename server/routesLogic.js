/**
 * Created by sbardian on 12/13/16.
 */
'use strict'

const CreditCard = require('../app/models/CreditCard');
const Total = require('../app/models/Total');
const User = require('../app/models/user');

const routesLogic = {

  /**
   * Login|Auth to the app
   *
   * @param req the request
   * @param res the response
   * @param next
   */
  loginRegister(req, res, next) {
    // confirm that user typed same password twice
    if (req.body.password !== req.body.passwordConf) {
      let err = new Error('Passwords do not match.');
      err.status = 400;
      res.send("passwords dont match");
      return next(err);
    }

    if (req.body.email &&
        req.body.username &&
        req.body.password &&
        req.body.passwordConf) {

      let userData = {
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        passwordConf: req.body.passwordConf,
      };

      User.create(userData, function (error, user) {
        if (error) {
          return next(error);
        } else {
          req.session.userId = user._id;
          return res.redirect('/profile');
        }
      });

    } else if (req.body.logemail && req.body.logpassword) {
      User.authenticate(req.body.logemail, req.body.logpassword, function (error, user) {
        if (error || !user) {
          let err = new Error('Wrong email or password.');
          err.status = 401;
          return next(err);
        } else {
          req.session.userId = user._id;
          return res.redirect('/profile');
        }
      });
    } else {
      let err = new Error('All fields required.');
      err.status = 400;
      return next(err);
    }
  },

  /**
   * Logout from the app
   *
   * @param req the request
   * @param res the response
   * @param next
   */
  logout(req, res, next) {
    if (req.session) {
      // delete session object
      req.session.destroy(function (err) {
        if (err) {
          return next(err);
        } else {
          return res.redirect('/');
        }
      });
    }
  },

  /**
   * Add a new credit card to the database.
   *
   * @param req the request
   * @param res the response
   */
  addCreditCard(req, res) {
    const db = new CreditCard();
    let response = {};
    db.user = req.body.user;
    db.name = req.body.name;
    db.limit = req.body.limit;
    db.balance = req.body.balance;
    db.interest_rate = req.body.interest_rate;
    db.save((err) => {
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
  },

  /**
   * Get all the credit cards in the database.
   *
   * @param req the request
   * @param res the response
   */
  getAllCreditCards(req, res) {
    // TODO: Update to use query to sort (ex: 'sort=balance', 'sort=interest_rate'.
    let response = {};
    CreditCard.find({}, (err, data) => {
      if (err) {
        response = { error: true, message: 'Error fetching data' };
      } else {
        response = { error: false, message: data };
      }
      res.json(response);
    }).sort([['balance', 'descending']]);
  },

  /**
   * Get a specific credit card by its ID
   *
   * @param req the request
   * @param res the response
   */
  getCreditCardByID(req, res) {
    let response = {};
    CreditCard.findById(req.params.id, (err, data) => {
      if (err) {
        response = { error: true, message: 'Error fetching data' };
      } else {
        response = { error: false, message: data };
      }
      res.json(response);
    });
  },

  /**
   * Add or update (if exists) a credit card.
   *
   * @param req the request
   * @param res the response
   */
  putOrUpdate(req, res) {
    let response = {};
    CreditCard.findById(req.params.id, (err, initialData) => {
      const data = initialData;
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
            response = { error: false, message: `Data is updated for ${req.body.name}` };
          }
          res.json(response);
        });
      }
    });
  },

  /**
   * delete a credit card from the database.
   *
   * @param req the request
   * @param res the response
   */
  deleteCreditCard(req, res) {
    let response = {};
    CreditCard.findById(req.params.id, (err) => {
      if (err) {
        response = { error: true, message: 'Error fetching data' };
      } else {
        CreditCard.remove({ _id: req.params.id }, () => {
          if (err) {
            response = { error: true, message: 'Error deleting data' };
          } else {
            response = { error: false, message: `Data associated with ${req.params.id} is deleted` };
          }
          res.json(response);
        });
      }
    });
  },

  /**
   * Get credit card totals from the database.
   *
   * @param req the request
   * @param res the response
   */
  getTotals(req, res) {
    let response = {};
    Total.find({}, (err, data) => {
      if (err) {
        response = { error: true, message: 'Error fetching data' };
      } else {
        response = { error: false, message: data };
      }
      res.json(response);
    }).sort([['updated_at', 'descending']]);
  },

  /**
   * Add a new Total to the database.
   *
   * @param req the request
   * @param res the response
   */
  addTotal(req, res) {
    const db = new Total();
    let response = {};
    db.user = req.body.user;
    db.total = req.body.total;
    db.save((err) => {
      if (err) {
        response = { error: true, message: 'Error adding data' };
      } else {
        response = {
          error: false,
          message: 'Data added',
          id: db.id,
          updated_at: db.updated_at,
          v: db.v,
        };
      }
      res.json(response);
    });
  },

  /**
   * Delete a Total from the database.
   *
   * @param req the request
   * @param res the response
   */
  deleteTotal(req, res) {
    let response = {};
    Total.findById(req.params.id, (err) => {
      if (err) {
        response = { error: true, message: 'Error fetching data' };
      } else {
        Total.remove({ _id: req.params.id }, () => {
          if (err) {
            response = { error: true, message: 'Error deleting data' };
          } else {
            response = { error: false, message: `Data associated with ${req.params.id} is deleted` };
          }
          res.json(response);
        });
      }
    });
  },
};

module.exports = routesLogic;
