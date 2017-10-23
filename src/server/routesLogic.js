/**
 * Created by sbardian on 12/13/16.
 */
'use strict'

const CreditCard = require('./models/CreditCard');
const Total = require('./models/Total');
const User = require('./models/User');

const routesLogic = {

  /**
   * Login|Auth to the app
   *
   * @param req the request
   * @param res the response
   * @param next
   */
  login(req, res, next) {
    console.log('login request');
    if (req.body.email && req.body.password) {
      User.authenticate(req.body.email, req.body.password, function (error, user) {
        if (error || !user) {
          let err = new Error('Wrong email or password.');
          err.status = 401;
          return next(err);
        } else {
          req.session.userId = user._id;
          console.log('login req session = ', req.session.userId);
          res.set({
            location: '/',
          });
          return res.status(301).send(req.session.username);
        }
      });
    }
    else {
      console.log('error on body - ', req.body);
    }
  },

  /**
   * Register to the app
   *
   * @param req
   * @param res
   * @param next
   * @returns {*}
   */
  register(req, res, next) {
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
          console.log('register req = ', req.session);
          res.set({
            location: '/',
          });
          return res.status(301).send(req.session.username);
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
    console.log('logout req = ', req.session.destroy);
    if (req.session) {
      // delete session object
      req.session.destroy(function (err) {
        if (err) {
          return next(err);
        } else {
          console.log('logoooout');
          return res.redirect('http://localhost:8080/login');
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
    db.userId = req.session.userId;
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
  getAllCreditCards(req, res, next) {
    // TODO: Update to use query to sort (ex: 'sort=balance', 'sort=interest_rate'.
    console.log('getAllCreditCards req session = ', req.session.userId);
    User.findById(req.session.userId)
        .exec(function (error, user) {
          if (error) {
            console.log('error = ', error);
            return next(error);
          } else {
            if (user === null) {
              console.log('no user object');
              return res.redirect('/login');
            } else {
              console.log('session = ', req.session.userId);
              let response = {};
              CreditCard.find({ userId: req.session.userId }, (err, data) => {
                if (err) {
                  response = { error: true, message: 'Error fetching data' };
                } else {
                  response = { error: false, message: data };
                }
                res.json(response);
              }).sort([['balance', 'descending']]);
            }
          }
        });
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
    Total.find({ userId: req.session.userId }, (err, data) => {
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
    db.userId = req.session.userId;
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

  /**
   * Check if a client is authenticated.
   *
   */
  checkAuth(req, res, next) {
    if (!(req.session && req.session.userId)) {
      console.log('No Session.');
      return res.status(401).end();
    }
    console.log('Session found: ', req.session.userId);
    return next();
  }

};

module.exports = routesLogic;
