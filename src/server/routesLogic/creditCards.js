const CreditCard = require('../models/CreditCard');

export const getAllCreditCards = (req, res) => {
  // TODO: Update to use query to sort (ex: 'sort=balance', 'sort=interest_rate'.
  CreditCard.find({ userId: req.session.userId }, (error, data) => {
    if (error) {
      return res
        .status(400)
        .json({ error: true, message: 'Error fetching data' });
    }
    return res.json({ error: false, creditCards: data });
  }).sort([['balance', 'descending']]);
};

export const getCreditCardById = (req, res) => {
  CreditCard.findById(req.params.id, (error, data) => {
    if (error) {
      return res
        .status(400)
        .json({ error: true, message: 'Error fetching data' });
    }
    return res.json({ error: false, creditCard: data });
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
  creditCard.save((error, data) => {
    if (error) {
      return res
        .status(400)
        .json({ error: true, message: 'Error adding data' });
    }
    return res.json({
      error: false,
      message: `Card '${req.body.name}' added`,
      creditCard: data,
    });
  });
};

export const deleteCreditCard = (req, res) => {
  CreditCard.findById(req.params.id, (findError, card) => {
    if (findError) {
      return res
        .status(400)
        .json({ error: true, message: 'Error fetching card data for delete' });
    }
    CreditCard.remove({ _id: req.params.id }, (removeError, data) => {
      if (removeError) {
        return res
          .status(400)
          .json({ error: true, message: `Error deleting ${card.name} data` });
      }
      return res.json({
        error: false,
        message: `Data associated with card '${card.name}' deleted`,
        creditCard: data,
      });
    });
  });
};

export const putOrUpdate = (req, res) => {
  CreditCard.findById(req.params.id, (error, card) => {
    const updatedCard = card;
    if (error) {
      return res
        .status(400)
        .json({ error: true, message: 'Error fetching card data' });
    }
    updatedCard.userId = req.session.userId;
    updatedCard.name = req.body.name;
    updatedCard.limit = req.body.limit;
    updatedCard.balance = req.body.balance;
    updatedCard.interest_rate = req.body.interest_rate;
    updatedCard.save((saveError, data) => {
      if (saveError) {
        return res.status(400).json({
          error: true,
          message: `Error updating card ${data.name} data`,
        });
      }
      return res.json({
        error: false,
        message: `Data is updated for card ${card.name}`,
      });
    });
  });
};
