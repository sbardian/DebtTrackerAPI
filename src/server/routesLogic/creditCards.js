const User = require('../models/User');
const CreditCard = require('../models/CreditCard');

export const getAllCreditCards = (req, res) => {
  // TODO: Update to use query to sort (ex: 'sort=balance', 'sort=interest_rate'.
  User.findById(req.session && req.session.userId, userError => {
    if (userError) {
      return res
        .status(400)
        .json({ error: true, message: 'Error fetching data' });
    }
    CreditCard.find({ userId: req.session.userId }, (cardError, data) => {
      if (cardError) {
        return res
          .status(400)
          .json({ error: true, message: 'Error fetching data' });
      }
      return res.json({ error: false, message: data });
    }).sort([['balance', 'descending']]);
  });
};

export const getCreditCardById = (req, res) => {
  CreditCard.findById(req.params.id, (err, data) => {
    if (err) {
      return res
        .status(400)
        .json({ error: true, message: 'Error fetching data' });
    }
    return res.json({ error: false, message: data });
  });
};

export const addCreditCard = (req, res) => {
  const creditCard = new CreditCard();
  creditCard.userId = req.session.userId;
  creditCard.user = req.body.user;
  creditCard.name = req.body.name;
  creditCard.limit = req.body.limit;
  creditCard.balance = req.body.balance;
  creditCard.interest_rate = req.body.interest_rate;
  creditCard.save((err, data) => {
    if (err) {
      return res
        .status(400)
        .json({ error: true, message: 'Error adding data' });
    }
    return res.json({
      error: false,
      message: 'Data added',
      data,
    });
  });
};

export const deleteCreditCard = (req, res) => {
  CreditCard.findById(req.params.id, (findError, card) => {
    if (findError) {
      return res
        .status(400)
        .json({ error: true, message: 'Error fetching data' });
    }
    CreditCard.remove({ _id: req.params.id }, removeError => {
      if (removeError) {
        return res
          .status(400)
          .json({ error: true, message: 'Error deleting data' });
      }
      return res.json({
        error: false,
        message: `Data associated with ${card.name} is deleted`,
      });
    });
  });
};

export const putOrUpdate = (req, res) => {
  CreditCard.findById(req.params.id, (err, initialData) => {
    const data = initialData;
    if (err) {
      return res
        .status(400)
        .json({ error: true, message: 'Error fetching data' });
    }
    data.userId = req.session.userId;
    data.name = req.body.name;
    data.limit = req.body.limit;
    data.balance = req.body.balance;
    data.interest_rate = req.body.interest_rate;
    data.save(saveError => {
      if (saveError) {
        return res
          .status(400)
          .json({ error: true, message: 'Error updating data' });
      }
      return res.json({
        error: false,
        message: `Data is updated for ${req.body.name}`,
      });
    });
  });
};
